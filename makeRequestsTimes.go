package main

func main() {
	times := []float64{0,241.3264883321301,1152.3589886544678,2746.604819849088,3327.6236916082466,4176.353458630038,4722.779109558366,4887.876004552476,4929.070316232553,5076.015424496483,5829.604284354481,5947.343636320517,6681.150608183777,6751.703043509949,7664.950028739526,7875.819458833466,8161.94079584969,9329.146354851915,9973.812807635615,10000}
	makeRequests(times,"http://127.0.0.1:8080/dispatch?customer=123")
}