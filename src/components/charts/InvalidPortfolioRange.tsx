import { DETFReturnChart } from "./DETFReturnChart"
import "./InvalidPortfolioRange.css"

const data = [{
    "date": "2021-06-21",
    "index_price": 14.8547195248,
    "performance_7d": -0.0409012437,
    "performance_30d": -0.0462838109,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-22",
    "index_price": 11.3010640804,
    "performance_7d": -0.304863134,
    "performance_30d": -0.190532587,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-23",
    "index_price": 11.0733636928,
    "performance_7d": -0.3177004014,
    "performance_30d": -0.0587110827,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-24",
    "index_price": 12.6735237211,
    "performance_7d": -0.152899236,
    "performance_30d": -0.2408075408,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-25",
    "index_price": 12.9118673011,
    "performance_7d": -0.1502873896,
    "performance_30d": -0.2186464963,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-26",
    "index_price": 11.4351528431,
    "performance_7d": -0.2070271812,
    "performance_30d": -0.383289042,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-27",
    "index_price": 11.2755028164,
    "performance_7d": -0.2063032944,
    "performance_30d": -0.3593270008,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-28",
    "index_price": 12.0500918064,
    "performance_7d": -0.1888038151,
    "performance_30d": -0.2095475979,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-29",
    "index_price": 12.5100334041,
    "performance_7d": 0.106978362,
    "performance_30d": -0.098676264,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-06-30",
    "index_price": 13.0438082749,
    "performance_7d": 0.1779445376,
    "performance_30d": -0.1335759629,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-01",
    "index_price": 13.0764640573,
    "performance_7d": 0.0317938677,
    "performance_30d": -0.2357938254,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-02",
    "index_price": 12.1567749669,
    "performance_7d": -0.0584804906,
    "performance_30d": -0.2791964795,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-03",
    "index_price": 12.2508402361,
    "performance_7d": 0.0713315689,
    "performance_30d": -0.3254275421,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-04",
    "index_price": 12.8126386042,
    "performance_7d": 0.1363252542,
    "performance_30d": -0.3556927362,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-05",
    "index_price": 13.4184510704,
    "performance_7d": 0.1135559202,
    "performance_30d": -0.2446809738,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-06",
    "index_price": 13.3038324407,
    "performance_7d": 0.063452991,
    "performance_30d": -0.2375635443,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-07",
    "index_price": 14.5057219212,
    "performance_7d": 0.1120772105,
    "performance_30d": -0.1716191861,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-08",
    "index_price": 14.3721532987,
    "performance_7d": 0.0990855965,
    "performance_30d": -0.0956834835,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-09",
    "index_price": 13.4563309152,
    "performance_7d": 0.1068997289,
    "performance_30d": -0.1496156924,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-10",
    "index_price": 13.7625569577,
    "performance_7d": 0.1233969828,
    "performance_30d": -0.1972648195,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-11",
    "index_price": 14.019742999,
    "performance_7d": 0.0942120068,
    "performance_30d": -0.1017465363,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-12",
    "index_price": 14.1744889027,
    "performance_7d": 0.0563431523,
    "performance_30d": -0.0349276591,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-13",
    "index_price": 13.8574739611,
    "performance_7d": 0.0416151904,
    "performance_30d": -0.0470065187,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-14",
    "index_price": 13.371189512,
    "performance_7d": -0.0782127505,
    "performance_30d": -0.1366857375,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-15",
    "index_price": 13.0515849648,
    "performance_7d": -0.0918838191,
    "performance_30d": -0.197187291,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-16",
    "index_price": 12.5009409252,
    "performance_7d": -0.0709992936,
    "performance_30d": -0.2297383873,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-17",
    "index_price": 11.6586990503,
    "performance_7d": -0.1528682434,
    "performance_30d": -0.2207303123,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-18",
    "index_price": 11.5079789098,
    "performance_7d": -0.179159068,
    "performance_30d": -0.2426753953,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-19",
    "index_price": 11.8124324447,
    "performance_7d": -0.1666413847,
    "performance_30d": -0.1808646565,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-20",
    "index_price": 10.9530805235,
    "performance_7d": -0.2095903947,
    "performance_30d": -0.2289990017,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-21",
    "index_price": 10.2707566314,
    "performance_7d": -0.2318741259,
    "performance_30d": -0.3085862972,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-22",
    "index_price": 11.8452220189,
    "performance_7d": -0.0924303791,
    "performance_30d": 0.0481510356,
    "performance_90d": null,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-23",
    "index_price": 11.9739563384,
    "performance_7d": -0.0421555937,
    "performance_30d": 0.0813296366,
    "performance_90d": -0.5863748534,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-24",
    "index_price": 12.5669615209,
    "performance_7d": 0.0779042727,
    "performance_30d": -0.0084082535,
    "performance_90d": -0.5546606615,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-25",
    "index_price": 12.7998339612,
    "performance_7d": 0.1122573357,
    "performance_30d": -0.0086767729,
    "performance_90d": -0.5662264117,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-26",
    "index_price": 12.7828623682,
    "performance_7d": 0.0821532676,
    "performance_30d": 0.1178567129,
    "performance_90d": -0.6116320524,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-27",
    "index_price": 13.3102943948,
    "performance_7d": 0.2152101289,
    "performance_30d": 0.1804612718,
    "performance_90d": -0.6194169726,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-28",
    "index_price": 13.8834625651,
    "performance_7d": 0.3517468151,
    "performance_30d": 0.1521457918,
    "performance_90d": -0.6057949917,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-29",
    "index_price": 13.8504295196,
    "performance_7d": 0.1692840791,
    "performance_30d": 0.1071456864,
    "performance_90d": -0.6616106187,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-30",
    "index_price": 13.9970983736,
    "performance_7d": 0.1689618684,
    "performance_30d": 0.0730837251,
    "performance_90d": -0.6463755577,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-07-31",
    "index_price": 14.4201896148,
    "performance_7d": 0.1474682715,
    "performance_30d": 0.1027590908,
    "performance_90d": -0.6100574077,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-01",
    "index_price": 15.3868175719,
    "performance_7d": 0.2021107163,
    "performance_30d": 0.2656989715,
    "performance_90d": -0.6136937948,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-02",
    "index_price": 15.0417730145,
    "performance_7d": 0.1767139926,
    "performance_30d": 0.2278156212,
    "performance_90d": -0.6253474723,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-03",
    "index_price": 15.1678987021,
    "performance_7d": 0.1395614742,
    "performance_30d": 0.1838231898,
    "performance_90d": -0.5785361895,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-04",
    "index_price": 15.4188347771,
    "performance_7d": 0.1105900063,
    "performance_30d": 0.1490770951,
    "performance_90d": -0.5978979582,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-05",
    "index_price": 16.4605076721,
    "performance_7d": 0.188447452,
    "performance_30d": 0.2372756306,
    "performance_90d": -0.5405260644,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-06",
    "index_price": 16.4218411927,
    "performance_7d": 0.1732318195,
    "performance_30d": 0.1320940303,
    "performance_90d": -0.5340832413,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-07",
    "index_price": 16.871945059,
    "performance_7d": 0.1700224137,
    "performance_30d": 0.1739330014,
    "performance_90d": -0.5406062541,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-08",
    "index_price": 17.2965557277,
    "performance_7d": 0.124115214,
    "performance_30d": 0.285384243,
    "performance_90d": -0.5469450989,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-09",
    "index_price": 16.3759263065,
    "performance_7d": 0.0886965447,
    "performance_30d": 0.1898898117,
    "performance_90d": -0.5365917574,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-10",
    "index_price": 17.2748771721,
    "performance_7d": 0.1389103732,
    "performance_30d": 0.2321821572,
    "performance_90d": -0.5268193256,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-11",
    "index_price": 17.8779864319,
    "performance_7d": 0.15949011,
    "performance_30d": 0.2612790877,
    "performance_90d": -0.4016804232,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-12",
    "index_price": 18.8085375274,
    "performance_7d": 0.1426462599,
    "performance_30d": 0.3572847101,
    "performance_90d": -0.3584439093,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-13",
    "index_price": 18.472880608,
    "performance_7d": 0.1248970436,
    "performance_30d": 0.3815435486,
    "performance_90d": -0.4202248963,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-14",
    "index_price": 20.0002493861,
    "performance_7d": 0.1854145634,
    "performance_30d": 0.5324000449,
    "performance_90d": -0.3073444791,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-15",
    "index_price": 19.6717018404,
    "performance_7d": 0.1373190218,
    "performance_30d": 0.5736176947,
    "performance_90d": -0.3238693719,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-16",
    "index_price": 19.8257558277,
    "performance_7d": 0.210664695,
    "performance_30d": 0.7005118446,
    "performance_90d": -0.2316651436,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-17",
    "index_price": 20.0775676848,
    "performance_7d": 0.1622408359,
    "performance_30d": 0.7446649705,
    "performance_90d": -0.2400674128,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-18",
    "index_price": 19.8954499945,
    "performance_7d": 0.1128462408,
    "performance_30d": 0.6842805314,
    "performance_90d": 0.1369016722,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-19",
    "index_price": 19.7758032573,
    "performance_7d": 0.0514269506,
    "performance_30d": 0.8055014947,
    "performance_90d": 0.0369031064,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-20",
    "index_price": 20.558261478,
    "performance_7d": 0.1128887754,
    "performance_30d": 1.0016306701,
    "performance_90d": 0.3199001677,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-21",
    "index_price": 22.1600526112,
    "performance_7d": 0.1079888147,
    "performance_30d": 0.8708009504,
    "performance_90d": 0.587270042,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-22",
    "index_price": 21.4682398665,
    "performance_7d": 0.0913260093,
    "performance_30d": 0.7929111532,
    "performance_90d": 0.8249031478,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-23",
    "index_price": 21.1804599584,
    "performance_7d": 0.0683305162,
    "performance_30d": 0.685408197,
    "performance_90d": 0.2687904198,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-24",
    "index_price": 22.7626747347,
    "performance_7d": 0.1337366703,
    "performance_30d": 0.7783570321,
    "performance_90d": 0.3774689007,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-25",
    "index_price": 21.6130176156,
    "performance_7d": 0.0863296694,
    "performance_30d": 0.6907807495,
    "performance_90d": 0.1656149229,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-26",
    "index_price": 23.4644386236,
    "performance_7d": 0.1865226569,
    "performance_30d": 0.7628790114,
    "performance_90d": 0.3332471742,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-27",
    "index_price": 22.7120682127,
    "performance_7d": 0.1047659958,
    "performance_30d": 0.6359080529,
    "performance_90d": 0.4898483069,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-28",
    "index_price": 23.7091271211,
    "performance_7d": 0.0699039184,
    "performance_30d": 0.711797247,
    "performance_90d": 0.7081968005,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-29",
    "index_price": 23.0625330355,
    "performance_7d": 0.0742628729,
    "performance_30d": 0.6476652818,
    "performance_90d": 0.531909436,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-30",
    "index_price": 22.8157385886,
    "performance_7d": 0.0772069461,
    "performance_30d": 0.5822079458,
    "performance_90d": 0.3333824979,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-08-31",
    "index_price": 21.2325217486,
    "performance_7d": -0.0672220204,
    "performance_30d": 0.3799163894,
    "performance_90d": 0.2589256991,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-01",
    "index_price": 21.5824609619,
    "performance_7d": -0.0014138078,
    "performance_30d": 0.4348349055,
    "performance_90d": 0.1884028735,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-02",
    "index_price": 22.7791908089,
    "performance_7d": -0.0292036739,
    "performance_30d": 0.5018026726,
    "performance_90d": 0.1454938016,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-03",
    "index_price": 22.2513426283,
    "performance_7d": -0.0202854967,
    "performance_30d": 0.4431273796,
    "performance_90d": 0.2525188159,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-04",
    "index_price": 22.3659374622,
    "performance_7d": -0.0566528515,
    "performance_30d": 0.3587635271,
    "performance_90d": 0.2817814838,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-05",
    "index_price": 22.9708758953,
    "performance_7d": -0.0039742876,
    "performance_30d": 0.3988002701,
    "performance_90d": 0.3118018513,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-06",
    "index_price": 23.3082942197,
    "performance_7d": 0.0215884149,
    "performance_30d": 0.3814823447,
    "performance_90d": 0.466591331,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
},
{
    "date": "2021-09-07",
    "index_price": 23.6169064693,
    "performance_7d": 0.1122987061,
    "performance_30d": 0.3654109431,
    "performance_90d": 0.4924905445,
    "performance_180d": null,
    "performance_365d": null,
    "performance_730d": null
}]

interface InvalidPortfolioRangeProps {
    height: number
    width: string
}

export const InvalidPortfolioRange = (props: InvalidPortfolioRangeProps) => {
    return (
        <div className="invalid-portolfio-range" style={{ width: props.width, height: props.height }}>
            <div className="invalid-portolfio-range-chart"><DETFReturnChart width={props.width} height={props.height} performanceData={data} /></div>
            <div className="invalid-portolfio-range-overlay">
                <img className="invalid-portolfio-range-overlay-info" src={require("../../assets/icons/info_purple.png")}></img>
                Not enough data to display chart.</div>
        </div>)
}