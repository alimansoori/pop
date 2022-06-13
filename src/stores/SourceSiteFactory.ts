import Url from "../lib/Url";
import Store from "./Store";
import {Page} from "puppeteer";
import Target from "./t/target";
import IStore from "./IStore";
import Bulbs1000 from "./1/1000bulbs";
import Sale1 from "./1/1sale";
import Sgm from "./1/4sgm";
import Wheelparts4 from "./1/4wheelparts";
import Tactical from "./1/511tactical";
import A4c from "./a/a4c";
import Abesofmaine from "./a/abesofmaine";
import Abt from "./a/abt";
import Academy from "./a/academy";
import Accessorygeeks from "./a/accessorygeeks";
import Acehardware from "./a/acehardware";
import Aclens from "./a/aclens";
import Acmetools from "./a/acmetools";
import Acurite from "./a/acurite";
import Adafruit from "./a/adafruit";
import Adagio from "./a/adagio";
import Adenandanais from "./a/adenandanais";
import Adorama from "./a/adorama";
import Advanceautoparts from "./a/advanceautoparts";
import DesignMilk from "./d/design-milk";
import Airgas from "./a/airgas";
import Artsupplywarehouse from "./a/artsupplywarehouse";
import Backcountry from "./b/backcountry";
import Bangalla from "./b/bangalla";
import Barnesandnoble from "./b/barnesandnoble";
import Basspro from "./b/basspro";
import Beallsflorida from "./b/beallsflorida";
import Bedbathandbeyond from "./b/bedbathandbeyond";
import Belk from "./b/belk";
import Bestbuy from "./b/bestbuy";
import Bigapplecollectibles from "./b/bigapplecollectibles";
import Bigbadtoystore from "./b/bigbadtoystore";
import Biglots from "./b/biglots";
import Bloomingdales from "./b/bloomingdales";
import Banggood from "./b/banggood";
import Bookpal from "./b/bookpal";
import Bjs from "./b/bjs";
import Boxed from "./b/boxed";
import Burkesoutlet from "./b/burkesoutlet";
import Buybuybaby from "./b/buybuybaby";
import Cabelas from "./c/cabelas";
import Calendars from "./c/calendars";
import Campmor from "./c/campmor";
import Campsaver from "./c/campsaver";
import Carealotpets from "./c/carealotpets";
import Cardhaus from "./c/cardhaus";
import Cduniverse from "./c/cduniverse";
import Chewy from "./c/chewy";
import Christianbook from "./c/christianbook";
import Costco from "./c/costco";
import Cyclegear from "./c/cyclegear";
import Deepdiscount from "./d/deepdiscount";
import Dickssportinggoods from "./d/dickssportinggoods";
import Dillards from "./d/dillards";
import Dollargeneral from "./d/dollargeneral";
import Dorksidetoys from "./d/dorksidetoys";
import Empiretoyshop from "./e/empiretoyshop";
import Entertainmentearth from "./e/entertainmentearth";
import Entirelypets from "./e/entirelypets";
import Etundra from "./e/etundra";
import Fpnyc from "./f/fpnyc";
import Fye from "./f/fye";
import Fun from "./f/fun";
import Gamenerdz from "./g/gamenerdz";
import Gearx from "./g/gearx";
import Geekbuying from "./g/geekbuying";
import Geminicollectibles from "./g/geminicollectibles";
import Globalgolf from "./g/globalgolf";
import Guitarcenter from "./g/guitarcenter";
import Hardwareandtools from "./h/hardwareandtools";
import Healthypets from "./h/healthypets";
import Hobbylobby from "./h/hobbylobby";
import Homedepot from "./h/homedepot";
import Hottopic from "./h/hottopic";
import Hsn from "./h/hsn";
import Iherb from "./i/iherb";
import Ikea from "./i/ikea";
import Jefferspet from "./j/jefferspet";
import Jensonusa from "./j/jensonusa";
import Kmart from "./k/kmart";
import Knifecenter from "./k/knifecenter";
import Kohls from "./k/kohls";
import Lakeside from "./l/lakeside";
import Lowes from "./l/lowes";
import Lovelyskin from "./l/lovelyskin";
import Ltdcommodities from "./l/ltdcommodities";
import Lumens from "./l/lumens";
import Overstock from "./o/overstock";
import Campingworld from "./c/campingworld";
import Overtons from "./o/overtons";
import Surlatable from "./s/surlatable";
import Everythingkitchens from "./e/everythingkitchens";
import Wayfair from "./w/wayfair";
import Zzounds from "./z/zzounds";
import Musiciansfriend from "./m/musiciansfriend";
import Altomusic from "./a/altomusic";
import Walmart from "./w/walmart";
import Baseballmonkey from "./b/baseballmonkey";
import Macys from "./m/macys";
import Meijer from "./m/meijer";
import Michaels from "./m/michaels";
import Midwayusa from "./m/midwayusa";
import Miniaturemarket from "./m/miniaturemarket";
import Moosejaw from "./m/moosejaw";
import Netrition from "./n/netrition";
import Newegg from "./n/newegg";
import Nothingbutsavings from "./n/nothingbutsavings";
import Officedepot from "./o/officedepot";
import Partytoyz from "./p/partytoyz";
import Petedge from "./p/petedge";
import Pfaltzgraff from "./p/pfaltzgraff";
import Pharmaca from "./p/pharmaca";
import Quill from "./q/quill";
import Redtoolstore from "./r/redtoolstore";
import Rei from "./r/rei";
import Reptilesupplyco from "./r/reptilesupplyco";
import Revzilla from "./r/revzilla";
import Ringsidecollectibles from "./r/ringsidecollectibles";
import Rockler from "./r/rockler";
import Myotcstore from "./m/myotcstore";
import Toywiz from "./t/toywiz";
import Katom from "./k/katom";
import Restaurantsupply from "./r/restaurantsupply";
import Trisports from "./t/trisports";
import Thatpetplace from "./t/thatpetplace";
import Scheels from "./s/scheels";
import Healthyplanetshopping from "./h/healthyplanetshopping";
import Neweggbusiness from "./n/neweggbusiness";
import Webstaurantstore from "./w/webstaurantstore";
import Goodmans from "./g/goodmans";
import Mysimpleproducts from "./m/mysimpleproducts";
import Tf2sshop from "./t/tf2sshop";
import Homefurniturelife from "./h/homefurniturelife";
import Gamestop from "./g/gamestop";
import Aaatoysandcollectibles from "./a/aaatoysandcollectibles";
import Zoro from "./z/zoro";
import Sierra from "./s/sierra";
import Rainbowresource from "./r/rainbowresource";
import Ruralking from "./r/ruralking";
import Mardel from "./m/mardel";
import Popinabox from "./p/popinabox";
import Presleysoutdoors from "./p/presleysoutdoors";
import Walgreens from "./w/walgreens";
import Ae from "./a/ae";
import Stoplighting1 from "./1/1stoplighting";
import Wd4 from "./1/4wd";
import AZapplianceparts from "./a/a-zapplianceparts";
import Abbottstore from "./a/abbottstore";
import Acer from "./a/acer";
import Activepowersports from "./a/activepowersports";
import Activerideshop from "./a/activerideshop";
import Zulily from "./z/zulily";
import WilliamsSonoma from "./w/williams-sonoma";
import Allstarhealth from "./a/allstarhealth";
import Petswarehouse from "./p/petswarehouse";
import Theisens from "./t/theisens";
import Familyotc from "./f/familyotc";
import Vitacost from "./v/vitacost";
import Samsclub from "./s/samsclub";
import Foodservicedirect from "./f/foodservicedirect";
import Focuscamera from "./f/focuscamera";
import Bigbangtoyslv from "./b/bigbangtoyslv";
import Woot from "./w/woot";
import Udans from "./u/udans";
import Hasbropulse from "./h/hasbropulse";
import Surethingtoys from "./s/surethingtoys";
import Questtoys from "./q/questtoys";
import PlayAsia from "./p/playAsia";
import Boscovs from "./b/boscovs";
import Galactictoys from "./g/galactictoys";
import Toyshnip from "./t/toyshnip";
import Sallybeauty from "./s/sallybeauty";
import Sephora from "./s/sephora";
import Staples from "./s/staples";
import Jcpenney from "./j/jcpenney";
import Advancedbionutritionals from "./a/advancedbionutritionals";
import Nordstrom from "./n/nordstrom";
import Legacytoys from "./l/legacytoys";
import Toygamewiz from "./t/toygamewiz";
import Fruugo from "./f/fruugo";
import Petflow from "./p/petflow";
import Insanetoyshop from "./i/insanetoyshop";
import Roadrunnersports from "./r/roadrunnersports";
import Rcwilley from "./r/rcwilley";
import Shumistore from "./s/shumistore";
import Poptoys from "./p/poptoys";
import Shop4megastore from "./s/shop4megastore";
import Bhphotovideo from "./b/bhphotovideo";
import Vipoutlet from "./v/vipoutlet";
import Zavvi from "./z/zavvi";
import Playerschoicevideogames from "./p/playerschoicevideogames";
import Pishposhbaby from "./p/pishposhbaby";
import Leatherman from "./l/leatherman";
import Bathandbodyworks from "./b/bathandbodyworks";
import Ulta from "./u/ulta";
import Oldies from "./o/oldies";
import Boardlandia from "./b/boardlandia";
import Glossier from "./g/glossier";
import Americanedgeknives from "./a/americanedgeknives";
import Keurig from "./k/keurig";
import Babyearth from "./b/babyearth";
import Brandscycle from "./b/brandscycle";
import Zumiez from "./z/zumiez";
import Petsense from "./p/petsense";
import Alltimetoys from "./a/alltimetoys";

export default class SourceSiteFactory {
    static async create(page: Page, url: string): Promise<IStore> {
        let domain: string | undefined = url
        if (Url.isValidHttpUrl(url)) {
            domain = Url.getDomain(url)
        }

        if (domain === "tacticalbucket") {
            await page.goto(url, {waitUntil: "domcontentloaded"})
            url = page.url()
            domain = Url.getDomain(page.url())
        }

        // if (!domain) return new Store(page, url)

        if (domain === 'amazon') throw new Error('Reject Amazon site')
        else if (domain === 'houzz') throw new Error('Reject Houzz site')
        else if (domain === '1000bulbs') return new Bulbs1000(page, url)
        else if (domain === '1sale') return new Sale1(page, url)
        else if (domain === '1stoplighting') return new Stoplighting1(page, url)
        else if (domain === '4wd') return new Wd4(page, url)
        // else if (domain === '4sgm') return new Sgm(page, url)
        else if (domain === '4wheelparts') return new Wheelparts4(page, url)
            // else if (domain === '511tactical') return new Tactical(page, url)
        // else if (domain === 'a4c') return new A4c(page, url)
        else if (domain === 'a-zapplianceparts') return new AZapplianceparts(page, url)
        else if (domain === 'aaatoysandcollectibles') return new Aaatoysandcollectibles(page, url)
        else if (domain === 'abbottstore') return new Abbottstore(page, url)
        else if (domain === 'abesofmaine') return new Abesofmaine(page, url)
        // else if (domain === 'abt') return new Abt(page, url)
        else if (domain === 'academy') return new Academy(page, url)
        else if (domain === 'accessorygeeks') return new Accessorygeeks(page, url)
        else if (domain === 'acehardware') return new Acehardware(page, url)
        else if (domain === 'acer') return new Acer(page, url)
        else if (domain === 'aclens') return new Aclens(page, url)
        else if (domain === 'acmetools') return new Acmetools(page, url)
        else if (domain === 'activepowersports') return new Activepowersports(page, url)
        else if (domain === 'activerideshop') return new Activerideshop(page, url)
        else if (domain === 'acurite') return new Acurite(page, url)
        else if (domain === 'adafruit') return new Adafruit(page, url)
        else if (domain === 'adagio') return new Adagio(page, url)
        else if (domain === 'adenandanais') return new Adenandanais(page, url)
        else if (domain === 'adorama') return new Adorama(page, url)
        else if (domain === 'advancedbionutritionals') return new Advancedbionutritionals(page, url)
        else if (domain === 'advanceautoparts') return new Advanceautoparts(page, url)
        else if (domain === 'ae') return new Ae(page, url)
        // else if (domain === 'design-milk') return new DesignMilk(page, url)
        else if (domain === 'airgas') return new Airgas(page, url)
        else if (domain === 'altomusic') return new Altomusic(page, url)
        else if (domain === 'alltimetoys') return new Alltimetoys(page, url)
        else if (domain === 'allstarhealth') return new Allstarhealth(page, url)
        else if (domain === 'artsupplywarehouse') return new Artsupplywarehouse(page, url)
        else if (domain === 'americanedgeknives') return new Americanedgeknives(page, url)
        else if (domain === 'backcountry') return new Backcountry(page, url)
        else if (domain === 'babyearth') return new Babyearth(page, url)
        else if (domain === 'bangalla') return new Bangalla(page, url)
        else if (domain === 'bathandbodyworks') return new Bathandbodyworks(page, url)
        else if (domain === 'barnesandnoble') return new Barnesandnoble(page, url)
        else if (domain === 'baseballmonkey') return new Baseballmonkey(page, url)
        // else if (domain === 'basspro') return new Basspro(page, url)
        else if (domain === 'beallsflorida') return new Beallsflorida(page, url)
        else if (domain === 'bedbathandbeyond') return new Bedbathandbeyond(page, url)
        else if (domain === 'belk') return new Belk(page, url)
        else if (domain === 'bestbuy') return new Bestbuy(page, url)
        else if (domain === 'bigapplecollectibles') return new Bigapplecollectibles(page, url)
        else if (domain === 'bigbadtoystore') return new Bigbadtoystore(page, url)
        else if (domain === 'bigbangtoyslv') return new Bigbangtoyslv(page, url)
        else if (domain === 'biglots') return new Biglots(page, url)
        else if (domain === 'bloomingdales') return new Bloomingdales(page, url)
        else if (domain === 'boardlandia') return new Boardlandia(page, url)
        else if (domain === 'boscovs') return new Boscovs(page, url)
        else if (domain === 'bhphotovideo') return new Bhphotovideo(page, url)
        else if (domain === 'banggood') return new Banggood(page, url)
        // else if (domain === 'bookpal') return new Bookpal(page, url)
        else if (domain === 'bjs') return new Bjs(page, url)
        else if (domain === 'boxed') return new Boxed(page, url)
        else if (domain === 'burkesoutlet') return new Burkesoutlet(page, url)
        else if (domain === 'buybuybaby') return new Buybuybaby(page, url)
        else if (domain === 'brandscycle') return new Brandscycle(page, url)
        // else if (domain === 'cabelas') return new Cabelas(page, url)
        else if (domain === 'calendars') return new Calendars(page, url)
        else if (domain === 'campmor') return new Campmor(page, url)
        else if (domain === 'campsaver') return new Campsaver(page, url)
        else if (domain === 'campingworld') return new Campingworld(page, url)
        else if (domain === 'carealotpets') return new Carealotpets(page, url)
        else if (domain === 'cardhaus') return new Cardhaus(page, url)
        else if (domain === 'cduniverse') return new Cduniverse(page, url)
        else if (domain === 'chewy') return new Chewy(page, url)
        else if (domain === 'christianbook') return new Christianbook(page, url)
        else if (domain === 'costco') return new Costco(page, url)
        else if (domain === 'cyclegear') return new Cyclegear(page, url)
        else if (domain === 'deepdiscount') return new Deepdiscount(page, url)
        else if (domain === 'dickssportinggoods') return new Dickssportinggoods(page, url)
        else if (domain === 'dillards') return new Dillards(page, url)
        else if (domain === 'dollargeneral') return new Dollargeneral(page, url)
        else if (domain === 'dorksidetoys') return new Dorksidetoys(page, url)
        else if (domain === 'empiretoyshop') return new Empiretoyshop(page, url)
        else if (domain === 'entertainmentearth') return new Entertainmentearth(page, url)
        else if (domain === 'entirelypets') return new Entirelypets(page, url)
        else if (domain === 'etundra') return new Etundra(page, url)
        else if (domain === 'everythingkitchens') return new Everythingkitchens(page, url)
        else if (domain === 'familyotc') return new Familyotc(page, url)
        else if (domain === 'foodservicedirect') return new Foodservicedirect(page, url)
        else if (domain === 'focuscamera') return new Focuscamera(page, url)
        else if (domain === 'fruugo') return new Fruugo(page, url)
        else if (domain === 'fpnyc') return new Fpnyc(page, url)
        else if (domain === 'fye') return new Fye(page, url)
        else if (domain === 'fun') return new Fun(page, url)
        else if (domain === 'gamenerdz') return new Gamenerdz(page, url)
        else if (domain === 'galactictoys') return new Galactictoys(page, url)
        else if (domain === 'gamestop') return new Gamestop(page, url)
        else if (domain === 'glossier') return new Glossier(page, url)
        else if (domain === 'gearx') return new Gearx(page, url)
        else if (domain === 'geekbuying') return new Geekbuying(page, url)
        else if (domain === 'geminicollectibles') return new Geminicollectibles(page, url)
        else if (domain === 'globalgolf') return new Globalgolf(page, url)
        else if (domain === 'goodmans') return new Goodmans(page, url)
        else if (domain === 'guitarcenter') return new Guitarcenter(page, url)
        else if (domain === 'hasbropulse') return new Hasbropulse(page, url)
        else if (domain === 'hardwareandtools') return new Hardwareandtools(page, url)
        else if (domain === 'homefurniturelife') return new Homefurniturelife(page, url)
        else if (domain === 'healthypets') return new Healthypets(page, url)
        else if (domain === 'healthyplanetshopping') return new Healthyplanetshopping(page, url)
        else if (domain === 'hobbylobby') return new Hobbylobby(page, url)
        else if (domain === 'homedepot') return new Homedepot(page, url)
        else if (domain === 'hottopic') return new Hottopic(page, url)
        else if (domain === 'hsn') return new Hsn(page, url)
        else if (domain === 'iherb') return new Iherb(page, url)
        else if (domain === 'ikea') return new Ikea(page, url)
        else if (domain === 'insanetoyshop') return new Insanetoyshop(page, url)
        else if (domain === 'jefferspet') return new Jefferspet(page, url)
        else if (domain === 'jcpenney') return new Jcpenney(page, url)
        else if (domain === 'jensonusa') return new Jensonusa(page, url)
        else if (domain === 'katom') return new Katom(page, url)
        else if (domain === 'keurig') return new Keurig(page, url)
        else if (domain === 'knifecenter') return new Knifecenter(page, url)
        else if (domain === 'kohls') return new Kohls(page, url)
        // else if (domain === 'lakeside') return new Lakeside(page, url)
        else if (domain === 'legacytoys') return new Legacytoys(page, url)
        else if (domain === 'lowes') return new Lowes(page, url)
        else if (domain === 'leatherman') return new Leatherman(page, url)
        else if (domain === 'lovelyskin') return new Lovelyskin(page, url)
        else if (domain === 'ltdcommodities') return new Ltdcommodities(page, url)
        else if (domain === 'lumens') return new Lumens(page, url)
        else if (domain === 'macys') return new Macys(page, url)
        else if (domain === 'mardel') return new Mardel(page, url)
        else if (domain === 'michaels') return new Michaels(page, url)
        else if (domain === 'midwayusa') return new Midwayusa(page, url)
        else if (domain === 'miniaturemarket') return new Miniaturemarket(page, url)
        else if (domain === 'moosejaw') return new Moosejaw(page, url)
        else if (domain === 'myotcstore') return new Myotcstore(page, url)
        else if (domain === 'mysimpleproducts') return new Mysimpleproducts(page, url)
        else if (domain === 'musiciansfriend') return new Musiciansfriend(page, url)
        // else if (domain === 'netrition') return new Netrition(page, url)
        else if (domain === 'newegg') return new Newegg(page, url)
        else if (domain === 'neweggbusiness') return new Neweggbusiness(page, url)
        else if (domain === 'nordstrom') return new Nordstrom(page, url)
        else if (domain === 'nothingbutsavings') return new Nothingbutsavings(page, url)
        else if (domain === 'oldies') return new Oldies(page, url)
        else if (domain === 'officedepot') return new Officedepot(page, url)
        else if (domain === 'overstock') return new Overstock(page, url)
        else if (domain === 'overtons') return new Overtons(page, url)
        else if (domain === 'partytoyz') return new Partytoyz(page, url)
        else if (domain === 'petflow') return new Petflow(page, url)
        else if (domain === 'petedge') return new Petedge(page, url)
        else if (domain === 'petsense') return new Petsense(page, url)
        else if (domain === 'petswarehouse') return new Petswarehouse(page, url)
        else if (domain === 'poptoys') return new Poptoys(page, url)
        else if (domain === 'pishposhbaby') return new Pishposhbaby(page, url)
        else if (domain === 'popinabox') return new Popinabox(page, url)
        else if (domain === 'presleysoutdoors') return new Presleysoutdoors(page, url)
        else if (domain === 'play-asia') return new PlayAsia(page, url)
        else if (domain === 'pharmaca') return new Pharmaca(page, url)
        else if (domain === 'playerschoicevideogames') return new Playerschoicevideogames(page, url)
        else if (domain === 'questtoys') return new Questtoys(page, url)
        else if (domain === 'quill') return new Quill(page, url)
        else if (domain === 'rainbowresource') return new Rainbowresource(page, url)
        else if (domain === 'redtoolstore') return new Redtoolstore(page, url)
        else if (domain === 'rei') return new Rei(page, url)
        else if (domain === 'reptilesupplyco') return new Reptilesupplyco(page, url)
        else if (domain === 'revzilla') return new Revzilla(page, url)
        else if (domain === 'restaurantsupply') return new Restaurantsupply(page, url)
        else if (domain === 'ringsidecollectibles') return new Ringsidecollectibles(page, url)
        else if (domain === 'rockler') return new Rockler(page, url)
        else if (domain === 'rcwilley') return new Rcwilley(page, url)
        else if (domain === 'roadrunnersports') return new Roadrunnersports(page, url)
        else if (domain === 'ruralking') return new Ruralking(page, url)
        else if (domain === 'sallybeauty') return new Sallybeauty(page, url)
        else if (domain === 'samsclub') return new Samsclub(page, url)
        else if (domain === 'sephora') return new Sephora(page, url)
        else if (domain === 'surlatable') return new Surlatable(page, url)
        else if (domain === 'surethingtoys') return new Surethingtoys(page, url)
        else if (domain === 'sierra') return new Sierra(page, url)
        else if (domain === 'staples') return new Staples(page, url)
        else if (domain === 'shop4megastore') return new Shop4megastore(page, url)
        else if (domain === 'shumistore') return new Shumistore(page, url)
        else if (domain === 'scheels') return new Scheels(page, url)
        else if (domain === 'target') return new Target(page, url)
        else if (domain === 'thatpetplace') return new Thatpetplace(page, url)
        else if (domain === 'theisens') return new Theisens(page, url)
        else if (domain === 'tf2sshop') return new Tf2sshop(page, url)
        else if (domain === 'toyshnip') return new Toyshnip(page, url)
        else if (domain === 'toywiz') return new Toywiz(page, url)
        else if (domain === 'toygamewiz') return new Toygamewiz(page, url)
        else if (domain === 'trisports') return new Trisports(page, url)
        else if (domain === 'udans') return new Udans(page, url)
        else if (domain === 'ulta') return new Ulta(page, url)
        else if (domain === 'vipoutlet') return new Vipoutlet(page, url)
        else if (domain === 'vitacost') return new Vitacost(page, url)
        else if (domain === 'walmart') return new Walmart(page, url)
        else if (domain === 'walgreens') return new Walgreens(page, url)
        else if (domain === 'wayfair') return new Wayfair(page, url)
        else if (domain === 'woot') return new Woot(page, url)
        else if (domain === 'webstaurantstore') return new Webstaurantstore(page, url)
        else if (domain === 'williams-sonoma') return new WilliamsSonoma(page, url)
        else if (domain === 'zulily') return new Zulily(page, url)
        else if (domain === 'zzounds') return new Zzounds(page, url)
        else if (domain === 'zoro') return new Zoro(page, url)
        else if (domain === 'zumiez') return new Zumiez(page, url)
        else if (domain === 'zavvi') return new Zavvi(page, url)
        else {
            await page.close()
            throw new Error(`>>>> Domain ${domain} is not defined`)
        }
    }
}