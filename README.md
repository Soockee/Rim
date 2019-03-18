# Rim

Environment built on HotR.O.D. ([Jaeger](https://github.com/jaegertracing/jaeger) demo application) to produce trace data emulating a running distributed application, instrumented through the OpenTracing API and configurable to introduce issues in its behaviour at runtime. The detailed description can be found in the thesis elaborate [Towards observability with (RDF) trace stream processing](https://www.politesi.polimi.it/handle/10589/144741).

This basic application offers the user the possibility to make only one type of request interacting with the `Frontend` service. Each request made crosses all four services:
- `Frontend` service provides a simple web-app to make HTTP GET requests to the `/dispatch` endpoint. Clicking one of the four buttons available, each related to a specific `customerId`, it is possible to ask for a driver to be dispatched at the customer location. The request is sent to the back-end service that calls all others micro-services and responds with the driver's license plate number and the expected time of arrival.
- `Customer` service is called through an `HTTP GET` call and it emulates a query to an SQL database returning data about the customer identified by the given `customerId`: `location` and `customerName`.
- `Driver` service exposes the `findNearest` service through [Thrift](https://thrift.apache.org) over [TChannel](https://github.com/uber/tchannel). Emulating a Redis database, it randomly generates ten drivers available in the area of the customer and for each of them returns the `driverId` (license plate number) and `locationDriverv.
- `Route` service is called through an `HTTP GET` call and computes the ETA (Estimated Time of Arrival) from the driver to the customer location.

<p align="center"><img src="/dispatchSD.png" alt="Dispatch SD" width="600"></p>

The four microservices are instrumented with the [OpenTracing API for GoLang](https://github.com/opentracing/opentracing-go) and the `Jaeger` tracer is configured to handle traces (sampling is not active). In order to exemplify the goal of distributed tracing some operations are intentionally misconfigured or not optimised: latencies of some operations are manually increased, some errors are randomly generated, and artificial bottlenecks are created (in red in the SD).

We changed the networking configurations in HotR.O.D. to enable each service to run as a different process on a different machine and thus to enable containerization of services. We build a unique [Docker](https://docs.docker.com) image for HotR.O.D. that can be used to run separately each service and a [docker-compose](https://docs.docker.com/compose/) file to instantiate HotR.O.D. with each service running on a different container.
To allow spawning more than one instance we made the docker-compose file configurable through environment variables. In this way it is possible to easily launch multiple instances of the application also on the same machine, reachable at different addresses and not clashing exploiting project namespace (`-p` option of `docker-compose`).

To allow spawning more than one instance we made the docker-compose file configurable through environment variables. In this way it is possible to easily launch multiple instances of the application also on the same machine reachable at different addresses and not clashing exploiting project namespace (`-p` option of `docker-compose`).
In order to enable scalability, we guarantee a "for-instance" scaling, i.e., to scale the application we can run another instance of all four services. Each instance is spawned and configured through the `docker-compose` file and has its internal sub-network exposing only the `frontend` endpoint. We opted for this solution because it ensures requests sent to a specific `frontend service are served only from micro-services of that instance, giving guarantees on the configurations provided for the given instance. To clarify this concept we show an example, let's suppose we want to launch two instances configured differently, we can execute the following commands:

```sh
HOTROD_INSTANCE="hotrod1" FIX_DB_QUERY_DELAY="--fix-db-query-delay=2ms" HOST_PORT_FRONTEND=8080 docker-compose -f hotrod-docker-compose.yml -p hotrod1 up
HOTROD_INSTANCE="hotrod2" HOST_PORT_FRONTEND=8090 docker-compose -f hotrod-docker-compose.yml -p hotrod2 up
```

In this example, the instance `hotrod1` will have a simulated query delay in service `customer` slower than the default value (300 ms) of instance `hotrod2`. Since we do not allow to scale each service independently, we can ensure that each request sent to the endpoint `:8080/dispatch` will have the query delay configured for `hotrod1`, and each request sent to the endpoint `:8090/dispatch` will have the default query delay configured for `hotrod2`.

Rim also provides a way to generate requests on instances reproducibly and systematically. To this scope it uses:
- a Javascript library [makerequests.js](https://github.com/marioscrock/makerequests.js) to generate in-browser load tests given a set of parameters,
- a UI integrated into the HotR.O.D. application to use the library, and
- a GoLang script, configurable with downloadable files produced by the library, to execute load tests on target instances.

We decided to build a Javascript library so that it can be integrated with the UI of the `frontend` service. In this way, it is possible to avoid resorting to external tools for load testing.
The UI provided allow to choose the clickable object to make requests on, or a _random_ selection (for each request made, between all clickable elements specified). Also, it allows to set a textual `seed` to initiate the random pseudo-generator to guarantee reproducibility. The default method to generate requests is to specify a _number of requests_ to be generated all at once. Otherwise, it is possible to select a distribution and provide parameters to determine how requests will be generated.

Modern browsers allow only for a limited set of concurrent requests, therefore, to generate a higher number of requests, we also implement an option to generate a GoLang file `makeRequestsTimes.go` containing endpoint URLs and timing of requests to be executed. This file can be run together with the `makeRequests.go` file provided to generate a set of go-routines executing requests as specified through the graphical interface. Moreover, the file can be easily tuned to implement more complex logic in the execution of the load test and to target multiple instances of the application.

## Deployment
The `docker-compose` file provided in this repository uses a Docker image bounding the HotR.O.D. app and a customized `jaeger-agent` to enable the deployment of [Kaiju-TSP](https://github.com/marioscrock/Kaiju-TSP) and [Jaeger](https://github.com/jaegertracing/jaeger) to process traces sampled.

<p align="center"><img src="/deployment.png" alt="Deployment" width="600"></p>
