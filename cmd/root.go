// Copyright (c) 2017 Uber Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package cmd

import (
	"math/rand"
	"os"
	"time"

	"github.com/spf13/cobra"
	"github.com/uber/jaeger-lib/metrics"
	jexpvar "github.com/uber/jaeger-lib/metrics/expvar"
	jprom "github.com/uber/jaeger-lib/metrics/prometheus"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"

	"github.com/Rim/services/config"
)

var (
	metricsBackend string
	jAgentHostPort string
	logger         *zap.Logger
	metricsFactory metrics.Factory

	fixDBConnDelay         time.Duration
	fixRedisFindDelay      time.Duration
	fixRedisGetDelay       time.Duration
	fixRouteCalcDelay       time.Duration
	fixDBConnDisableMutex  bool
	fixRouteWorkerPoolSize int
)

// RootCmd represents the base command when called without any subcommands
var RootCmd = &cobra.Command{
	Use:   "examples-hotrod",
	Short: "HotR.O.D. - A tracing demo application",
	Long:  `HotR.O.D. - A tracing demo application.`,
}

// Execute adds all child commands to the root command sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	if err := RootCmd.Execute(); err != nil {
		logger.Fatal("We bowled a googly", zap.Error(err))
		os.Exit(-1)
	}
}

func init() {
	RootCmd.PersistentFlags().StringVarP(&metricsBackend, "metrics", "m", "expvar", "Metrics backend (expvar|prometheus)")
	RootCmd.PersistentFlags().StringVarP(&jAgentHostPort, "jaeger-agent.host-port", "a", "0.0.0.0:6831", "String representing jaeger-agent UDP host:port, or jaeger-collector HTTP endpoint address, e.g. http://localhost:14268/api/traces.")
	RootCmd.PersistentFlags().DurationVarP(&fixDBConnDelay, "fix-db-query-delay", "D", 300*time.Millisecond, "Average lagency of MySQL DB query")
	RootCmd.PersistentFlags().DurationVarP(&fixRedisFindDelay, "fix-redis-find-delay", "F", 20*time.Millisecond, "How long finding closest drivers takes")
	RootCmd.PersistentFlags().DurationVarP(&fixRedisGetDelay, "fix-redis-get-delay", "G", 10*time.Millisecond, "How long retrieving a driver record takes")
	RootCmd.PersistentFlags().DurationVarP(&fixRouteCalcDelay, "fix-route-calc-delay", "R", 50*time.Millisecond, "How long a route calculation takes")
	RootCmd.PersistentFlags().BoolVarP(&fixDBConnDisableMutex, "fix-disable-db-conn-mutex", "M", false, "Disables the mutex guarding db connection")
	RootCmd.PersistentFlags().IntVarP(&fixRouteWorkerPoolSize, "fix-route-worker-pool-size", "W", 3, "Default worker pool size")
	rand.Seed(int64(time.Now().Nanosecond()))
	logger, _ = zap.NewDevelopment(zap.AddStacktrace(zapcore.FatalLevel))
	cobra.OnInitialize(onInitialize)
}

// onInitialize is called before the command is executed.
func onInitialize() {
	if metricsBackend == "expvar" {
		metricsFactory = jexpvar.NewFactory(10) // 10 buckets for histograms
		logger.Info("Using expvar as metrics backend")
	} else if metricsBackend == "prometheus" {
		metricsFactory = jprom.New().Namespace("hotrod", nil)
		logger.Info("Using Prometheus as metrics backend")
	} else {
		logger.Fatal("unsupported metrics backend " + metricsBackend)
	}
	if config.MySQLGetDelay != fixDBConnDelay {
		logger.Info("fix: overriding MySQL query delay", zap.Duration("old", config.MySQLGetDelay), zap.Duration("new", fixDBConnDelay))
		config.MySQLGetDelay = fixDBConnDelay
		config.MySQLGetDelayStdDev = fixDBConnDelay / 10 
	}
	if config.RedisFindDelay != fixRedisFindDelay {
		logger.Info("fix: overriding Redis find delay", zap.Duration("old", config.RedisFindDelay), zap.Duration("new", fixRedisFindDelay))
		config.RedisFindDelay = fixRedisFindDelay
		config.RedisFindDelayStdDev = fixRedisFindDelay / 10
	}
	if config.RedisGetDelay != fixRedisGetDelay {
		logger.Info("fix: overriding Redis get delay", zap.Duration("old", config.RedisGetDelay), zap.Duration("new", fixRedisGetDelay))
		config.RedisGetDelay = fixRedisGetDelay
		config.RedisGetDelayStdDev = fixRedisGetDelay / 10
	}
	if config.RouteCalcDelay != fixRouteCalcDelay {
		logger.Info("fix: overriding route calc delay", zap.Duration("old", config.RouteCalcDelay), zap.Duration("new", fixRouteCalcDelay))
		config.RouteCalcDelay = fixRouteCalcDelay
		config.RouteCalcDelayStdDev = fixRouteCalcDelay / 10
	}
	if fixDBConnDisableMutex {
		logger.Info("fix: disabling db connection mutex")
		config.MySQLMutexDisabled = true
	}
	if config.RouteWorkerPoolSize != fixRouteWorkerPoolSize {
		logger.Info("fix: overriding route worker pool size", zap.Int("old", config.RouteWorkerPoolSize), zap.Int("new", fixRouteWorkerPoolSize))
		config.RouteWorkerPoolSize = fixRouteWorkerPoolSize
	}
}

func logError(logger *zap.Logger, err error) error {
	if err != nil {
		logger.Error("Error running command", zap.Error(err))
	}
	return err
}
