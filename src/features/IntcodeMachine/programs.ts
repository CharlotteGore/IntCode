const programs: { [name: string]: string } = {
  default: "99",
  day2:
    "1,12,2,3,1,1,2,3,1,3,4,3,1,5,0,3,2,1,10,19,2,6,19,23,1,23,5,27,1,27,13,31,2,6,31,35,1,5,35,39,1,39,10,43,2,6,43,47,1,47,5,51,1,51,9,55,2,55,6,59,1,59,10,63,2,63,9,67,1,67,5,71,1,71,5,75,2,75,6,79,1,5,79,83,1,10,83,87,2,13,87,91,1,10,91,95,2,13,95,99,1,99,9,103,1,5,103,107,1,107,10,111,1,111,5,115,1,115,6,119,1,119,10,123,1,123,10,127,2,127,13,131,1,13,131,135,1,135,10,139,2,139,6,143,1,143,9,147,2,147,6,151,1,5,151,155,1,9,155,159,2,159,6,163,1,163,2,167,1,10,167,0,99,2,14,0,0",
  day5:
    "3,225,1,225,6,6,1100,1,238,225,104,0,101,14,135,224,101,-69,224,224,4,224,1002,223,8,223,101,3,224,224,1,224,223,223,102,90,169,224,1001,224,-4590,224,4,224,1002,223,8,223,1001,224,1,224,1,224,223,223,1102,90,45,224,1001,224,-4050,224,4,224,102,8,223,223,101,5,224,224,1,224,223,223,1001,144,32,224,101,-72,224,224,4,224,102,8,223,223,101,3,224,224,1,223,224,223,1102,36,93,225,1101,88,52,225,1002,102,38,224,101,-3534,224,224,4,224,102,8,223,223,101,4,224,224,1,223,224,223,1102,15,57,225,1102,55,49,225,1102,11,33,225,1101,56,40,225,1,131,105,224,101,-103,224,224,4,224,102,8,223,223,1001,224,2,224,1,224,223,223,1102,51,39,225,1101,45,90,225,2,173,139,224,101,-495,224,224,4,224,1002,223,8,223,1001,224,5,224,1,223,224,223,1101,68,86,224,1001,224,-154,224,4,224,102,8,223,223,1001,224,1,224,1,224,223,223,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,108,226,677,224,1002,223,2,223,1006,224,329,1001,223,1,223,1007,226,226,224,1002,223,2,223,1006,224,344,101,1,223,223,1008,226,226,224,102,2,223,223,1006,224,359,1001,223,1,223,107,226,677,224,1002,223,2,223,1005,224,374,101,1,223,223,1107,677,226,224,102,2,223,223,1006,224,389,101,1,223,223,108,677,677,224,102,2,223,223,1006,224,404,1001,223,1,223,1108,677,226,224,102,2,223,223,1005,224,419,101,1,223,223,1007,677,226,224,1002,223,2,223,1006,224,434,101,1,223,223,1107,226,226,224,1002,223,2,223,1006,224,449,101,1,223,223,8,677,226,224,102,2,223,223,1006,224,464,1001,223,1,223,1107,226,677,224,102,2,223,223,1005,224,479,1001,223,1,223,1007,677,677,224,102,2,223,223,1005,224,494,1001,223,1,223,1108,677,677,224,102,2,223,223,1006,224,509,101,1,223,223,1008,677,677,224,102,2,223,223,1005,224,524,1001,223,1,223,107,226,226,224,1002,223,2,223,1005,224,539,101,1,223,223,7,226,226,224,102,2,223,223,1005,224,554,101,1,223,223,1108,226,677,224,1002,223,2,223,1006,224,569,1001,223,1,223,107,677,677,224,102,2,223,223,1005,224,584,101,1,223,223,7,677,226,224,1002,223,2,223,1005,224,599,101,1,223,223,108,226,226,224,1002,223,2,223,1005,224,614,101,1,223,223,1008,677,226,224,1002,223,2,223,1005,224,629,1001,223,1,223,7,226,677,224,102,2,223,223,1005,224,644,101,1,223,223,8,677,677,224,102,2,223,223,1005,224,659,1001,223,1,223,8,226,677,224,102,2,223,223,1006,224,674,1001,223,1,223,4,223,99,226",
  day7:
    "3,8,1001,8,10,8,105,1,0,0,21,34,47,72,81,102,183,264,345,426,99999,3,9,102,5,9,9,1001,9,3,9,4,9,99,3,9,101,4,9,9,1002,9,3,9,4,9,99,3,9,102,3,9,9,101,2,9,9,102,5,9,9,1001,9,3,9,1002,9,4,9,4,9,99,3,9,101,5,9,9,4,9,99,3,9,101,3,9,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,99,3,9,101,1,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,99",
  "output-10-to-1": `1101,0,10,18,1101,0,-1,19,4,18,1001,18,-1,18,1005,18,8,99,0,0`,
  "add-inputs": `1101,0,10,26,1101,0,-1,27,3,25,1,24,25,24,1,26,27,26,1005,26,8,4,24,99,0,0,0,0`,
  day9test: "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99",
  "large-number": "1102,34915192,34915192,7,4,7,99,0",
  "output-large": "104,1125899906842624,99",
  day9:
    "1102,34463338,34463338,63,1007,63,34463338,63,1005,63,53,1102,3,1,1000,109,988,209,12,9,1000,209,6,209,3,203,0,1008,1000,1,63,1005,63,65,1008,1000,2,63,1005,63,904,1008,1000,0,63,1005,63,58,4,25,104,0,99,4,0,104,0,99,4,17,104,0,99,0,0,1101,0,33,1017,1101,24,0,1014,1101,519,0,1028,1102,34,1,1004,1101,0,31,1007,1101,0,844,1025,1102,0,1,1020,1102,38,1,1003,1102,39,1,1008,1102,849,1,1024,1101,0,22,1001,1102,25,1,1009,1101,1,0,1021,1101,0,407,1022,1101,404,0,1023,1101,0,35,1013,1101,27,0,1011,1101,0,37,1016,1102,1,26,1019,1102,28,1,1015,1101,0,30,1000,1102,1,36,1005,1101,0,29,1002,1101,23,0,1012,1102,1,32,1010,1102,21,1,1006,1101,808,0,1027,1102,20,1,1018,1101,0,514,1029,1102,1,815,1026,109,14,2107,24,-5,63,1005,63,199,4,187,1105,1,203,1001,64,1,64,1002,64,2,64,109,-1,2108,21,-7,63,1005,63,225,4,209,1001,64,1,64,1106,0,225,1002,64,2,64,109,-16,1201,6,0,63,1008,63,35,63,1005,63,249,1001,64,1,64,1106,0,251,4,231,1002,64,2,64,109,9,2102,1,2,63,1008,63,37,63,1005,63,271,1105,1,277,4,257,1001,64,1,64,1002,64,2,64,109,11,1208,-8,23,63,1005,63,293,1105,1,299,4,283,1001,64,1,64,1002,64,2,64,109,8,21107,40,39,-8,1005,1017,319,1001,64,1,64,1106,0,321,4,305,1002,64,2,64,109,-28,2101,0,6,63,1008,63,39,63,1005,63,341,1106,0,347,4,327,1001,64,1,64,1002,64,2,64,109,19,2107,26,-7,63,1005,63,363,1106,0,369,4,353,1001,64,1,64,1002,64,2,64,109,1,1202,-9,1,63,1008,63,39,63,1005,63,395,4,375,1001,64,1,64,1105,1,395,1002,64,2,64,109,9,2105,1,-3,1106,0,413,4,401,1001,64,1,64,1002,64,2,64,109,-13,1207,-4,26,63,1005,63,435,4,419,1001,64,1,64,1105,1,435,1002,64,2,64,109,-1,21101,41,0,7,1008,1019,41,63,1005,63,461,4,441,1001,64,1,64,1105,1,461,1002,64,2,64,109,7,21107,42,43,-2,1005,1017,479,4,467,1105,1,483,1001,64,1,64,1002,64,2,64,109,-6,21108,43,46,0,1005,1013,499,1106,0,505,4,489,1001,64,1,64,1002,64,2,64,109,17,2106,0,-2,4,511,1105,1,523,1001,64,1,64,1002,64,2,64,109,-27,1202,-1,1,63,1008,63,28,63,1005,63,547,1001,64,1,64,1106,0,549,4,529,1002,64,2,64,109,18,1206,-1,567,4,555,1001,64,1,64,1106,0,567,1002,64,2,64,109,-16,21102,44,1,6,1008,1011,43,63,1005,63,587,1106,0,593,4,573,1001,64,1,64,1002,64,2,64,109,8,21102,45,1,-1,1008,1012,45,63,1005,63,619,4,599,1001,64,1,64,1105,1,619,1002,64,2,64,109,7,1205,1,633,4,625,1106,0,637,1001,64,1,64,1002,64,2,64,109,-8,2102,1,-3,63,1008,63,25,63,1005,63,659,4,643,1105,1,663,1001,64,1,64,1002,64,2,64,109,14,1206,-5,679,1001,64,1,64,1105,1,681,4,669,1002,64,2,64,109,-28,2101,0,2,63,1008,63,30,63,1005,63,707,4,687,1001,64,1,64,1106,0,707,1002,64,2,64,109,21,21101,46,0,0,1008,1019,48,63,1005,63,727,1106,0,733,4,713,1001,64,1,64,1002,64,2,64,109,-3,21108,47,47,1,1005,1017,751,4,739,1106,0,755,1001,64,1,64,1002,64,2,64,109,-13,1207,0,37,63,1005,63,771,1105,1,777,4,761,1001,64,1,64,1002,64,2,64,109,7,2108,21,-9,63,1005,63,797,1001,64,1,64,1105,1,799,4,783,1002,64,2,64,109,22,2106,0,-5,1001,64,1,64,1106,0,817,4,805,1002,64,2,64,109,-4,1205,-8,829,1106,0,835,4,823,1001,64,1,64,1002,64,2,64,109,-4,2105,1,0,4,841,1105,1,853,1001,64,1,64,1002,64,2,64,109,-30,1208,6,30,63,1005,63,871,4,859,1105,1,875,1001,64,1,64,1002,64,2,64,109,-2,1201,9,0,63,1008,63,22,63,1005,63,897,4,881,1106,0,901,1001,64,1,64,4,64,99,21101,27,0,1,21102,1,915,0,1106,0,922,21201,1,66266,1,204,1,99,109,3,1207,-2,3,63,1005,63,964,21201,-2,-1,1,21102,942,1,0,1105,1,922,22101,0,1,-1,21201,-2,-3,1,21101,0,957,0,1106,0,922,22201,1,-1,-2,1105,1,968,21202,-2,1,-2,109,-3,2106,0,0",
  day11:
    "3,8,1005,8,301,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,1002,8,1,29,1,1103,7,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,1,8,10,4,10,1002,8,1,54,2,103,3,10,2,1008,6,10,1006,0,38,2,1108,7,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,1,8,10,4,10,1001,8,0,91,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,0,10,4,10,101,0,8,114,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,136,3,8,1002,8,-1,10,1001,10,1,10,4,10,1008,8,1,10,4,10,1002,8,1,158,1,1009,0,10,2,1002,18,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,1002,8,1,187,2,1108,6,10,3,8,1002,8,-1,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,213,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1001,8,0,236,1,104,10,10,1,1002,20,10,2,1008,9,10,3,8,102,-1,8,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,269,1,102,15,10,1006,0,55,2,1107,15,10,101,1,9,9,1007,9,979,10,1005,10,15,99,109,623,104,0,104,1,21102,1,932700598932,1,21102,318,1,0,1105,1,422,21102,1,937150489384,1,21102,329,1,0,1105,1,422,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21101,46325083227,0,1,21102,376,1,0,1106,0,422,21102,3263269927,1,1,21101,387,0,0,1105,1,422,3,10,104,0,104,0,3,10,104,0,104,0,21102,988225102184,1,1,21101,410,0,0,1105,1,422,21101,868410356500,0,1,21102,1,421,0,1106,0,422,99,109,2,21202,-1,1,1,21102,1,40,2,21102,1,453,3,21102,1,443,0,1105,1,486,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,448,449,464,4,0,1001,448,1,448,108,4,448,10,1006,10,480,1102,1,0,448,109,-2,2106,0,0,0,109,4,1201,-1,0,485,1207,-3,0,10,1006,10,503,21101,0,0,-3,22101,0,-3,1,21201,-2,0,2,21102,1,1,3,21101,0,522,0,1105,1,527,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,550,2207,-4,-2,10,1006,10,550,22102,1,-4,-4,1105,1,618,21201,-4,0,1,21201,-3,-1,2,21202,-2,2,3,21102,569,1,0,1106,0,527,22101,0,1,-4,21101,0,1,-1,2207,-4,-2,10,1006,10,588,21102,1,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,610,21201,-1,0,1,21101,610,0,0,105,1,485,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0",
  day13:
    "1,380,379,385,1008,2607,501667,381,1005,381,12,99,109,2608,1101,0,0,383,1101,0,0,382,20102,1,382,1,20102,1,383,2,21101,37,0,0,1106,0,578,4,382,4,383,204,1,1001,382,1,382,1007,382,41,381,1005,381,22,1001,383,1,383,1007,383,24,381,1005,381,18,1006,385,69,99,104,-1,104,0,4,386,3,384,1007,384,0,381,1005,381,94,107,0,384,381,1005,381,108,1105,1,161,107,1,392,381,1006,381,161,1102,-1,1,384,1105,1,119,1007,392,39,381,1006,381,161,1102,1,1,384,20102,1,392,1,21102,22,1,2,21102,0,1,3,21102,138,1,0,1105,1,549,1,392,384,392,21001,392,0,1,21102,1,22,2,21102,3,1,3,21101,0,161,0,1106,0,549,1102,0,1,384,20001,388,390,1,20102,1,389,2,21102,1,180,0,1105,1,578,1206,1,213,1208,1,2,381,1006,381,205,20001,388,390,1,20102,1,389,2,21102,1,205,0,1105,1,393,1002,390,-1,390,1102,1,1,384,20101,0,388,1,20001,389,391,2,21102,228,1,0,1105,1,578,1206,1,261,1208,1,2,381,1006,381,253,20102,1,388,1,20001,389,391,2,21102,1,253,0,1106,0,393,1002,391,-1,391,1102,1,1,384,1005,384,161,20001,388,390,1,20001,389,391,2,21102,1,279,0,1105,1,578,1206,1,316,1208,1,2,381,1006,381,304,20001,388,390,1,20001,389,391,2,21101,304,0,0,1106,0,393,1002,390,-1,390,1002,391,-1,391,1101,0,1,384,1005,384,161,21002,388,1,1,20102,1,389,2,21101,0,0,3,21102,338,1,0,1105,1,549,1,388,390,388,1,389,391,389,20102,1,388,1,20101,0,389,2,21101,4,0,3,21101,0,365,0,1106,0,549,1007,389,23,381,1005,381,75,104,-1,104,0,104,0,99,0,1,0,0,0,0,0,0,420,18,19,1,1,20,109,3,21201,-2,0,1,22102,1,-1,2,21101,0,0,3,21101,0,414,0,1106,0,549,22101,0,-2,1,22102,1,-1,2,21101,0,429,0,1106,0,601,1201,1,0,435,1,386,0,386,104,-1,104,0,4,386,1001,387,-1,387,1005,387,451,99,109,-3,2106,0,0,109,8,22202,-7,-6,-3,22201,-3,-5,-3,21202,-4,64,-2,2207,-3,-2,381,1005,381,492,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,481,21202,-4,8,-2,2207,-3,-2,381,1005,381,518,21202,-2,-1,-1,22201,-3,-1,-3,2207,-3,-2,381,1006,381,507,2207,-3,-4,381,1005,381,540,21202,-4,-1,-1,22201,-3,-1,-3,2207,-3,-4,381,1006,381,529,22102,1,-3,-7,109,-8,2106,0,0,109,4,1202,-2,41,566,201,-3,566,566,101,639,566,566,2101,0,-1,0,204,-3,204,-2,204,-1,109,-4,2106,0,0,109,3,1202,-1,41,594,201,-2,594,594,101,639,594,594,20101,0,0,-2,109,-3,2105,1,0,109,3,22102,24,-2,1,22201,1,-1,1,21102,1,499,2,21101,766,0,3,21102,984,1,4,21102,630,1,0,1106,0,456,21201,1,1623,-2,109,-3,2106,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,2,2,0,0,2,2,2,0,2,2,0,2,2,0,2,0,2,2,2,2,0,0,0,2,2,2,2,0,2,2,2,2,0,2,2,2,0,1,1,0,2,2,0,0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,2,2,2,2,2,0,2,0,2,2,2,2,2,2,0,0,2,2,0,0,1,1,0,2,2,2,2,2,2,2,0,2,2,2,2,2,0,2,2,0,0,2,2,2,0,2,2,2,0,0,2,0,0,2,2,2,2,2,0,2,0,1,1,0,2,2,2,2,2,0,2,2,2,0,2,2,2,2,0,0,0,0,2,2,2,2,2,2,0,2,2,0,0,0,2,2,2,0,0,0,2,0,1,1,0,2,2,2,0,2,2,2,2,2,2,2,2,0,0,0,0,2,0,2,0,2,2,2,0,2,2,2,2,2,2,2,2,0,2,0,2,2,0,1,1,0,2,2,2,2,2,2,0,0,2,0,0,0,2,2,2,0,0,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,0,1,1,0,0,2,2,2,2,0,2,2,2,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,0,0,2,2,2,2,2,0,0,0,2,0,2,0,1,1,0,0,2,2,0,2,2,0,2,2,0,0,2,2,2,2,2,0,2,2,0,2,2,2,2,2,2,2,2,2,2,2,0,2,0,2,2,2,0,1,1,0,2,0,2,0,0,2,0,0,2,2,2,0,2,2,0,2,2,2,2,2,2,2,2,0,2,2,2,2,2,0,2,2,2,2,2,2,0,0,1,1,0,2,2,2,2,2,2,2,2,2,0,2,2,0,2,2,0,0,0,2,2,0,2,2,2,2,2,2,2,0,2,2,0,0,2,0,2,0,0,1,1,0,2,0,0,0,2,2,0,2,0,2,2,0,2,2,2,2,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,0,0,1,1,0,2,2,2,0,2,2,2,0,0,2,2,2,0,2,2,0,2,2,2,2,2,2,0,2,2,2,2,2,0,0,0,2,0,2,2,2,0,0,1,1,0,2,2,2,2,0,2,0,2,0,0,2,2,2,2,0,0,0,2,2,2,2,0,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,0,1,1,0,0,2,2,0,0,2,2,2,2,2,2,2,2,2,0,2,2,2,2,2,2,0,2,2,2,0,2,2,2,0,0,2,2,2,0,2,2,0,1,1,0,2,2,0,0,0,2,2,2,2,0,2,0,0,2,2,0,2,2,2,2,0,0,2,2,2,0,2,2,2,0,2,2,2,0,2,2,2,0,1,1,0,2,2,2,2,2,0,0,2,0,2,2,2,0,2,2,2,2,2,2,0,2,0,2,2,2,2,0,2,0,0,2,0,2,2,0,2,2,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,68,30,70,17,8,95,58,65,89,47,70,26,8,7,65,13,54,62,14,76,19,56,81,92,65,56,46,12,32,48,52,92,70,30,90,26,97,53,52,49,43,93,5,20,81,91,23,4,60,46,14,90,66,33,56,57,89,29,17,45,81,11,39,9,97,68,86,36,92,25,41,66,92,50,25,96,70,82,96,45,47,26,21,97,16,55,93,90,14,24,86,65,19,44,66,36,60,86,79,95,47,37,82,8,34,17,89,74,17,74,40,97,43,92,26,94,14,58,9,68,48,32,42,60,31,35,96,88,71,93,80,78,66,32,76,13,45,86,53,31,82,77,11,69,67,63,88,16,94,77,48,11,90,53,54,12,92,27,66,77,86,31,36,91,50,55,98,72,53,92,33,64,61,23,52,31,25,69,89,18,94,1,80,83,30,13,47,71,91,35,55,19,89,57,92,77,46,54,77,59,9,13,20,4,57,81,22,61,33,83,18,38,24,41,83,48,70,82,33,7,8,41,56,47,85,89,85,65,93,40,95,73,47,87,24,42,10,64,71,77,57,18,21,8,30,83,55,10,94,19,52,80,89,67,40,1,80,60,36,71,80,77,62,16,23,40,68,50,17,81,26,22,65,92,47,46,43,21,81,20,50,40,84,90,97,73,95,39,12,76,9,41,92,59,8,10,32,54,34,59,32,26,74,63,90,13,46,96,40,98,52,34,65,95,16,73,54,74,28,73,2,36,69,19,68,71,33,24,44,53,56,7,58,25,15,49,77,40,30,59,87,29,36,65,71,92,21,14,44,5,4,34,87,81,71,36,42,59,20,76,36,39,27,68,62,85,80,96,66,56,96,86,53,60,52,7,65,77,8,51,88,10,26,77,74,57,78,22,19,6,86,33,91,66,15,81,15,37,36,98,17,48,82,5,37,82,76,36,65,17,18,54,47,73,5,54,84,77,4,73,16,54,10,12,6,76,97,45,63,30,26,54,97,60,44,12,80,94,33,16,43,88,85,52,5,73,30,23,41,76,10,92,79,13,52,95,67,4,41,10,96,7,92,80,33,2,60,25,83,49,20,42,83,31,49,71,25,74,52,48,83,12,50,26,13,86,21,21,50,7,31,71,77,12,91,2,18,93,22,15,28,40,27,41,84,10,85,93,65,67,13,80,36,10,52,79,2,29,18,48,47,42,4,12,12,75,44,41,21,75,69,6,63,61,29,51,59,58,9,70,25,57,39,67,83,6,90,63,56,2,58,96,5,94,85,22,92,14,58,91,16,1,55,58,24,77,74,41,70,49,90,23,26,54,74,70,40,65,38,31,2,80,93,21,60,56,3,94,87,53,73,59,73,26,21,76,66,94,81,60,43,39,14,18,89,33,73,47,2,96,50,76,84,27,43,1,29,45,59,37,81,82,56,19,71,20,90,48,67,21,16,16,40,77,22,96,32,47,15,87,74,42,98,97,52,83,96,9,51,95,34,29,16,44,3,32,65,86,25,93,1,20,95,26,6,22,58,33,46,3,38,94,95,85,57,52,11,14,12,28,86,92,55,45,26,60,57,21,3,84,7,12,57,17,86,41,46,37,89,4,91,1,12,46,71,5,84,21,83,7,56,95,40,20,26,65,51,90,2,64,33,69,4,92,58,88,8,58,46,31,19,24,35,28,40,58,52,4,56,28,38,6,89,73,74,94,16,70,59,93,8,66,8,50,89,56,5,5,71,30,86,20,70,64,35,90,54,59,1,36,3,40,31,37,77,21,74,38,7,15,5,43,14,67,38,96,90,36,84,81,66,8,33,77,73,64,3,35,96,12,91,71,60,43,30,44,87,61,21,37,68,43,24,29,26,57,75,31,76,36,32,92,95,39,54,75,79,90,98,49,34,38,79,55,53,36,47,35,3,79,89,70,84,43,58,7,92,57,96,96,23,35,59,56,78,9,4,42,35,46,86,61,34,36,89,33,5,51,56,88,34,10,44,86,95,95,20,97,15,41,85,42,37,1,8,29,48,10,6,51,61,53,97,72,83,8,41,15,27,38,20,70,59,70,66,95,31,46,22,73,68,27,45,31,61,51,10,5,81,37,27,34,30,95,83,67,10,52,26,87,56,64,70,78,14,86,76,94,15,82,70,18,26,48,94,15,52,39,47,51,15,51,20,14,23,45,29,8,9,47,9,30,27,76,57,98,57,73,72,13,35,26,45,70,30,84,91,65,12,6,91,98,78,40,501667",
  day15:
    "3,1033,1008,1033,1,1032,1005,1032,31,1008,1033,2,1032,1005,1032,58,1008,1033,3,1032,1005,1032,81,1008,1033,4,1032,1005,1032,104,99,101,0,1034,1039,1002,1036,1,1041,1001,1035,-1,1040,1008,1038,0,1043,102,-1,1043,1032,1,1037,1032,1042,1105,1,124,1002,1034,1,1039,101,0,1036,1041,1001,1035,1,1040,1008,1038,0,1043,1,1037,1038,1042,1106,0,124,1001,1034,-1,1039,1008,1036,0,1041,101,0,1035,1040,102,1,1038,1043,1001,1037,0,1042,1105,1,124,1001,1034,1,1039,1008,1036,0,1041,1002,1035,1,1040,1001,1038,0,1043,102,1,1037,1042,1006,1039,217,1006,1040,217,1008,1039,40,1032,1005,1032,217,1008,1040,40,1032,1005,1032,217,1008,1039,5,1032,1006,1032,165,1008,1040,7,1032,1006,1032,165,1101,2,0,1044,1106,0,224,2,1041,1043,1032,1006,1032,179,1102,1,1,1044,1105,1,224,1,1041,1043,1032,1006,1032,217,1,1042,1043,1032,1001,1032,-1,1032,1002,1032,39,1032,1,1032,1039,1032,101,-1,1032,1032,101,252,1032,211,1007,0,31,1044,1106,0,224,1101,0,0,1044,1106,0,224,1006,1044,247,1002,1039,1,1034,101,0,1040,1035,1001,1041,0,1036,102,1,1043,1038,1002,1042,1,1037,4,1044,1105,1,0,9,21,83,15,75,17,11,9,80,22,37,23,19,89,6,29,79,24,75,3,39,3,98,13,20,53,24,30,59,26,13,19,63,84,10,2,57,7,22,43,28,72,11,25,67,17,90,6,10,24,93,76,36,21,34,18,19,15,72,53,18,19,82,8,57,40,18,2,48,71,19,46,26,32,69,29,27,42,8,58,25,17,44,39,47,24,54,32,48,6,26,43,91,4,16,47,45,19,73,3,52,43,25,5,22,73,58,12,56,23,44,7,46,96,48,25,8,16,56,20,48,72,28,44,26,14,23,28,61,29,15,69,86,28,97,6,4,77,4,1,37,55,70,69,22,19,23,78,21,41,2,1,48,29,20,30,22,91,36,15,46,16,83,5,95,38,9,42,84,25,45,3,81,38,79,8,1,78,42,25,58,15,29,48,52,19,36,4,27,43,24,62,6,56,60,22,22,48,23,70,8,83,17,13,63,85,25,13,14,85,79,18,13,63,3,48,94,22,73,18,26,40,68,12,25,10,56,90,59,19,68,25,27,20,20,65,1,22,55,20,1,20,88,24,69,65,13,49,8,5,78,77,1,3,93,9,13,34,17,75,28,13,92,66,35,7,98,3,63,78,59,87,2,80,83,56,15,28,96,25,32,3,27,47,5,73,56,9,59,19,16,60,2,21,50,92,44,19,73,64,7,21,39,19,20,20,63,5,12,6,14,34,12,8,48,12,68,33,14,99,9,85,20,76,18,29,99,52,11,5,98,65,83,15,30,97,35,21,96,4,53,44,23,39,25,53,60,78,85,11,7,4,39,23,84,22,29,56,37,88,18,19,84,4,65,86,8,27,66,24,26,19,95,13,19,61,19,42,85,14,19,29,90,22,15,78,18,90,8,24,21,97,86,15,40,21,61,21,49,61,6,88,40,9,2,38,13,85,16,50,55,93,83,16,77,25,27,91,8,95,15,60,70,63,13,24,24,96,30,8,22,27,74,17,14,92,18,49,4,38,9,33,88,12,62,28,35,77,29,59,3,18,45,5,10,42,58,23,78,72,15,79,2,48,47,14,65,24,5,83,41,11,89,4,57,36,19,12,2,40,21,16,44,36,13,69,70,1,11,51,16,68,30,24,83,26,40,14,82,48,10,5,83,1,76,90,15,44,24,10,88,30,24,78,1,54,97,83,27,46,87,5,19,86,19,48,19,9,50,20,69,17,10,80,34,23,24,18,75,19,20,21,73,11,32,5,15,35,2,77,22,53,18,22,86,6,9,37,30,64,28,77,17,28,12,41,62,59,2,92,97,77,14,3,76,85,11,47,14,85,6,53,2,18,52,29,23,54,35,75,5,97,40,6,45,4,75,64,5,13,86,7,84,84,1,38,23,81,72,5,26,97,70,14,40,9,41,63,41,26,80,57,14,69,90,2,28,95,24,21,80,18,26,33,39,29,11,70,73,69,17,79,13,7,73,6,21,11,75,35,10,23,30,78,75,1,1,73,4,62,30,11,21,6,38,8,40,9,56,3,24,92,66,3,86,61,28,40,17,81,74,58,92,19,4,48,34,39,30,14,36,35,73,12,15,60,49,77,13,53,77,12,20,78,18,34,17,36,17,53,64,7,63,26,20,19,94,16,26,84,13,18,60,47,17,11,56,2,48,53,11,8,79,94,22,14,8,95,7,12,21,77,16,44,4,89,70,96,11,81,8,72,5,35,79,45,1,47,10,86,75,82,5,47,5,65,4,50,22,34,12,84,13,62,80,63,23,45,39,36,0,0,21,21,1,10,1,0,0,0,0,0,0",
  day17:
    "1,330,331,332,109,3406,1102,1182,1,15,1101,0,1481,24,1002,0,1,570,1006,570,36,1002,571,1,0,1001,570,-1,570,1001,24,1,24,1106,0,18,1008,571,0,571,1001,15,1,15,1008,15,1481,570,1006,570,14,21101,0,58,0,1105,1,786,1006,332,62,99,21101,0,333,1,21102,1,73,0,1106,0,579,1101,0,0,572,1101,0,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1001,574,0,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1105,1,81,21101,340,0,1,1105,1,177,21101,477,0,1,1106,0,177,21102,514,1,1,21102,1,176,0,1106,0,579,99,21102,184,1,0,1105,1,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1002,572,1,1182,21101,0,375,1,21101,0,211,0,1106,0,579,21101,1182,11,1,21102,222,1,0,1105,1,979,21102,388,1,1,21102,1,233,0,1106,0,579,21101,1182,22,1,21101,244,0,0,1105,1,979,21102,401,1,1,21102,1,255,0,1105,1,579,21101,1182,33,1,21101,0,266,0,1106,0,979,21101,414,0,1,21102,277,1,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21101,0,1182,1,21101,0,313,0,1106,0,622,1005,575,327,1101,0,1,575,21101,0,327,0,1105,1,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,26,16,0,109,4,2102,1,-3,587,20102,1,0,-1,22101,1,-3,-3,21102,0,1,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1105,1,597,109,-4,2105,1,0,109,5,2102,1,-4,629,21001,0,0,-2,22101,1,-4,-4,21102,1,0,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,653,20102,1,0,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21102,1,702,0,1105,1,786,21201,-1,-1,-1,1106,0,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21102,731,1,0,1106,0,786,1105,1,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21101,0,756,0,1105,1,786,1105,1,774,21202,-1,-11,1,22101,1182,1,1,21101,774,0,0,1106,0,622,21201,-3,1,-3,1106,0,640,109,-5,2106,0,0,109,7,1005,575,802,20102,1,576,-6,21002,577,1,-5,1105,1,814,21102,0,1,-1,21102,1,0,-5,21102,1,0,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,55,-3,22201,-6,-3,-3,22101,1481,-3,-3,2102,1,-3,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21101,0,1,-1,1106,0,924,1205,-2,873,21101,0,35,-4,1105,1,924,1202,-3,1,878,1008,0,1,570,1006,570,916,1001,374,1,374,2102,1,-3,895,1102,1,2,0,2101,0,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,921,21002,0,1,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,55,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,35,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1102,1,1,575,21101,973,0,0,1106,0,786,99,109,-7,2105,1,0,109,6,21102,0,1,-4,21102,1,0,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1106,0,1041,21101,-4,0,-2,1105,1,1041,21101,0,-5,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,1201,-2,0,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,2102,1,-2,0,1105,1,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1105,1,989,21102,1,439,1,1105,1,1150,21101,0,477,1,1106,0,1150,21102,514,1,1,21102,1,1149,0,1105,1,579,99,21102,1,1157,0,1106,0,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,2101,0,-5,1176,2101,0,-4,0,109,-6,2106,0,0,40,13,42,1,11,1,10,7,25,1,11,1,10,1,5,1,25,1,11,1,10,1,5,1,1,13,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,13,7,1,11,1,11,1,16,1,1,1,3,1,7,1,11,1,11,1,16,1,1,1,1,11,5,7,11,1,16,1,1,1,1,1,1,1,13,1,17,1,16,11,9,1,7,11,18,1,1,1,1,1,3,1,9,1,7,1,28,1,1,1,1,1,3,1,9,1,7,1,28,1,1,1,1,1,3,1,9,1,7,1,28,11,7,1,7,1,30,1,1,1,3,1,9,1,7,1,22,11,3,1,9,1,7,1,22,1,7,1,5,1,9,1,7,1,22,1,7,11,5,1,7,1,22,1,13,1,3,1,5,1,7,1,18,11,7,11,7,13,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,12,5,1,11,1,25,2,5,1,9,1,11,1,26,1,5,1,9,1,11,1,26,1,5,1,9,1,11,1,26,1,5,1,9,13,26,1,5,1,48,7,48",
  "day17.b":
    "2,330,331,332,109,3406,1102,1182,1,15,1101,0,1481,24,1002,0,1,570,1006,570,36,1002,571,1,0,1001,570,-1,570,1001,24,1,24,1106,0,18,1008,571,0,571,1001,15,1,15,1008,15,1481,570,1006,570,14,21101,0,58,0,1105,1,786,1006,332,62,99,21101,0,333,1,21102,1,73,0,1106,0,579,1101,0,0,572,1101,0,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1001,574,0,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1105,1,81,21101,340,0,1,1105,1,177,21101,477,0,1,1106,0,177,21102,514,1,1,21102,1,176,0,1106,0,579,99,21102,184,1,0,1105,1,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1002,572,1,1182,21101,0,375,1,21101,0,211,0,1106,0,579,21101,1182,11,1,21102,222,1,0,1105,1,979,21102,388,1,1,21102,1,233,0,1106,0,579,21101,1182,22,1,21101,244,0,0,1105,1,979,21102,401,1,1,21102,1,255,0,1105,1,579,21101,1182,33,1,21101,0,266,0,1106,0,979,21101,414,0,1,21102,277,1,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21101,0,1182,1,21101,0,313,0,1106,0,622,1005,575,327,1101,0,1,575,21101,0,327,0,1105,1,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,26,16,0,109,4,2102,1,-3,587,20102,1,0,-1,22101,1,-3,-3,21102,0,1,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1105,1,597,109,-4,2105,1,0,109,5,2102,1,-4,629,21001,0,0,-2,22101,1,-4,-4,21102,1,0,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,653,20102,1,0,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21102,1,702,0,1105,1,786,21201,-1,-1,-1,1106,0,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21102,731,1,0,1106,0,786,1105,1,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21101,0,756,0,1105,1,786,1105,1,774,21202,-1,-11,1,22101,1182,1,1,21101,774,0,0,1106,0,622,21201,-3,1,-3,1106,0,640,109,-5,2106,0,0,109,7,1005,575,802,20102,1,576,-6,21002,577,1,-5,1105,1,814,21102,0,1,-1,21102,1,0,-5,21102,1,0,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,55,-3,22201,-6,-3,-3,22101,1481,-3,-3,2102,1,-3,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21101,0,1,-1,1106,0,924,1205,-2,873,21101,0,35,-4,1105,1,924,1202,-3,1,878,1008,0,1,570,1006,570,916,1001,374,1,374,2102,1,-3,895,1102,1,2,0,2101,0,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,921,21002,0,1,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,55,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,35,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1102,1,1,575,21101,973,0,0,1106,0,786,99,109,-7,2105,1,0,109,6,21102,0,1,-4,21102,1,0,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1106,0,1041,21101,-4,0,-2,1105,1,1041,21101,0,-5,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,1201,-2,0,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,2102,1,-2,0,1105,1,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1105,1,989,21102,1,439,1,1105,1,1150,21101,0,477,1,1106,0,1150,21102,514,1,1,21102,1,1149,0,1105,1,579,99,21102,1,1157,0,1106,0,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,2101,0,-5,1176,2101,0,-4,0,109,-6,2106,0,0,40,13,42,1,11,1,10,7,25,1,11,1,10,1,5,1,25,1,11,1,10,1,5,1,1,13,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,1,5,1,1,1,11,1,11,1,11,1,10,13,7,1,11,1,11,1,16,1,1,1,3,1,7,1,11,1,11,1,16,1,1,1,1,11,5,7,11,1,16,1,1,1,1,1,1,1,13,1,17,1,16,11,9,1,7,11,18,1,1,1,1,1,3,1,9,1,7,1,28,1,1,1,1,1,3,1,9,1,7,1,28,1,1,1,1,1,3,1,9,1,7,1,28,11,7,1,7,1,30,1,1,1,3,1,9,1,7,1,22,11,3,1,9,1,7,1,22,1,7,1,5,1,9,1,7,1,22,1,7,11,5,1,7,1,22,1,13,1,3,1,5,1,7,1,18,11,7,11,7,13,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,1,6,1,3,1,5,1,11,1,25,12,5,1,11,1,25,2,5,1,9,1,11,1,26,1,5,1,9,1,11,1,26,1,5,1,9,1,11,1,26,1,5,1,9,13,26,1,5,1,48,7,48",
  day19: `109,424,203,1,21102,11,1,0,1106,0,282,21101,18,0,0,1106,0,259,2101,0,1,221,203,1,21102,31,1,0,1106,0,282,21102,1,38,0,1105,1,259,20102,1,23,2,22101,0,1,3,21101,0,1,1,21101,0,57,0,1106,0,303,1202,1,1,222,21001,221,0,3,20102,1,221,2,21102,259,1,1,21101,80,0,0,1105,1,225,21102,1,149,2,21101,0,91,0,1105,1,303,1202,1,1,223,21002,222,1,4,21102,259,1,3,21102,225,1,2,21102,225,1,1,21101,118,0,0,1105,1,225,20102,1,222,3,21101,0,127,2,21102,133,1,0,1105,1,303,21202,1,-1,1,22001,223,1,1,21102,1,148,0,1106,0,259,1201,1,0,223,21001,221,0,4,21002,222,1,3,21102,14,1,2,1001,132,-2,224,1002,224,2,224,1001,224,3,224,1002,132,-1,132,1,224,132,224,21001,224,1,1,21101,195,0,0,106,0,108,20207,1,223,2,20102,1,23,1,21101,0,-1,3,21102,214,1,0,1106,0,303,22101,1,1,1,204,1,99,0,0,0,0,109,5,1202,-4,1,249,22102,1,-3,1,21201,-2,0,2,21201,-1,0,3,21102,1,250,0,1105,1,225,22102,1,1,-4,109,-5,2106,0,0,109,3,22107,0,-2,-1,21202,-1,2,-1,21201,-1,-1,-1,22202,-1,-2,-2,109,-3,2105,1,0,109,3,21207,-2,0,-1,1206,-1,294,104,0,99,21202,-2,1,-2,109,-3,2106,0,0,109,5,22207,-3,-4,-1,1206,-1,346,22201,-4,-3,-4,21202,-3,-1,-1,22201,-4,-1,2,21202,2,-1,-1,22201,-4,-1,1,22101,0,-2,3,21101,343,0,0,1106,0,303,1106,0,415,22207,-2,-3,-1,1206,-1,387,22201,-3,-2,-3,21202,-2,-1,-1,22201,-3,-1,3,21202,3,-1,-1,22201,-3,-1,2,22101,0,-4,1,21102,1,384,0,1106,0,303,1105,1,415,21202,-4,-1,-4,22201,-4,-3,-4,22202,-3,-2,-2,22202,-2,-4,-4,22202,-3,-2,-3,21202,-4,-1,-2,22201,-3,-2,1,22102,1,1,-4,109,-5,2106,0,0`
};

export default programs;
