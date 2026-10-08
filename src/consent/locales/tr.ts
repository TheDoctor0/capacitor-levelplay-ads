import type { ConsentLocaleBundle } from '../../definitions';

/** Generated from the official IAB TCF translations (GVL v179) plus the plugin's UI copy. */
export const tr: ConsentLocaleBundle = {
  "ui": {
    "firstLayer.learnMore": "Daha fazla bilgi",
    "firstLayer.partners": "İş ortakları listesi.",
    "btn.consent": "Onaylıyorum",
    "btn.manage": "Seçenekleri yönet",
    "btn.acceptAll": "Tümünü kabul et",
    "btn.confirm": "Seçimleri onayla",
    "btn.back": "Geri",
    "manage.header": "Veri tercihleri",
    "manage.title": "Verilerinizi yönetin",
    "manage.subtitle": "Kişisel verilerinizin nasıl kullanılacağını seçebilirsiniz. Tedarikçiler aşağıdakiler için izninizi istiyor:",
    "manage.viewDetails": "Ayrıntıları görüntüle",
    "manage.storageTitle": "Saklama, süre ve kullanım ayrıntıları",
    "manage.vendorPreferences": "Tedarikçi tercihleri",
    "vendors.title": "Tedarikçilerimizi onaylayın",
    "vendors.subtitle": "Tedarikçiler hizmet sunmak için verilerinizi kullanabilir. Bir tedarikçiyi reddetmek, paylaştığınız verileri kullanmasını engelleyebilir.",
    "vendors.dataCollected": "Toplanan ve işlenen veriler:",
    "vendors.company": "Şirket:",
    "vendors.purposes": "Amaçlar:",
    "vendors.privacyPolicy": "Gizlilik politikası",
    "vendors.consent": "Onay",
    "details.examples": "Örnekler",
    "details.vendors": "Tedarikçiler",
    "firstLayer.title": "{appName}, kişisel verilerinizi aşağıdaki amaçlarla kullanmak için onayınızı istiyor:",
    "firstLayer.body": "Kişisel verileriniz işlenecek ve cihazınızdaki bilgiler (çerezler, benzersiz tanımlayıcılar ve diğer cihaz verileri) {count} iş ortağı tarafından saklanabilir, erişilebilir ve onlarla paylaşılabilir ya da yalnızca bu uygulama tarafından kullanılabilir.",
    "manage.consentWithCount.one": "Onay ({count} tedarikçi)",
    "manage.consentWithCount.other": "Onay ({count} tedarikçi)",
    "manage.legIntWithCount.one": "Meşru menfaat ({count} tedarikçi)",
    "manage.legIntWithCount.other": "Meşru menfaat ({count} tedarikçi)",
    "manage.tcfVendors": "TCF tedarikçileri",
    "vendors.tcfVendors": "TCF tedarikçileri",
    "vendors.header": "Tedarikçi tercihleri",
    "firstLayer.geolocation": "Biz ve iş ortaklarımız hassas konum verilerini kullanabiliriz.",
    "firstLayer.legInt": "Bazı tedarikçiler kişisel verilerinizi meşru menfaat temelinde işleyebilir; aşağıdaki seçenekleri yöneterek buna itiraz edebilirsiniz. Onayınızı istediğiniz zaman uygulamanın gizlilik ayarlarından değiştirebilir veya geri çekebilirsiniz.",
    "manage.specialFeatures": "Özel özellikler",
    "manage.howItWorks": "Bu onay yönetim platformu (CMP) nasıl çalışır:",
    "manage.cmpChoices": "CMP gizlilik tercihleri",
    "manage.storageBody": "Amaçlar ve tedarikçilerle ilgili seçimleriniz, kişiselleştirilmiş reklamların size nasıl sunulacağını etkiler. Bu uygulamada seçimleriniz cihaz depolamasında “IABTCF_” önekiyle {days} gün saklanır, ardından size yeniden sorarız.",
    "vendors.otherVendors": "Diğer tedarikçiler",
    "vendors.retention": "Saklama süresi: {days} gün.",
    "vendors.legInt": "Meşru menfaat",
    "vendors.alwaysActive": "Her zaman etkin",
    "vendors.legIntPurposes": "Amaçlar (meşru menfaat):",
    "vendors.specialFeatures": "Özel özellikler:",
    "vendors.location": "İşleme yeri:",
    "vendors.category.marketing": "Pazarlama",
    "vendors.category.functional": "İşlevsel",
    "vendors.category.essential": "Zorunlu"
  },
  "purposes": {
    "1": {
      "name": "Bilgileri bir cihazda depolamak ve/veya onlara cihazdan erişmek",
      "shortName": "Bilgileri bir cihazda depolamak ve/veya onlara cihazdan erişmek",
      "description": "Burada belirtilen amaçlardan biri veya birkaçı için, cihazınız bir uygulamaya veya bir web sitesine bağlandığı her seferinde onu tanınmak için cihazınıza başka bilgilerle birlikte (ör. tarayıcı türü ve bilgileri, dil, ekran boyutu, desteklenen teknolojiler vb.) çerezler, cihaz veya benzer çevrim içi tanımlayıcılar (ör. oturum açma tabanlı tanımlayıcılar, rastgele atanan tanımlayıcılar, ağ tabanlı tanımlayıcılar) depolanabilir veya okunabilir.",
      "illustrations": [
        "Bu bildirimde açıklanan çoğu amaç, bir uygulama kullandığınızda veya bir web sitesini ziyaret ettiğinizde cihazınızda bilgi depolanmasına veya bunlara erişilmesine dayanır. Örneğin, bir web sitesindeki ilk ziyaretiniz sırasında bir satıcının veya yayıncının bir sonraki ziyaretlerinizde cihazınızı tanıyabilmek için cihazınıza bir çerez depolaması gerekebilir (her seferinde bu çereze erişerek)."
      ]
    },
    "2": {
      "name": "Reklam seçmek için sınırlı veri kullanmak",
      "shortName": "Sınırlı verilere dayalı reklam göstermek",
      "description": "Bu hizmette size sunulan reklamlar, kullanmakta olduğunuz web sitesi veya uygulama, kesin olmayan konumunuz, cihaz türünüz veya etkileşimde bulunuyor olduğunuz (veya bulunmuş olduğunuz) içerik (örneğin size bir reklamın sunulma sayısını sınırlamak için) gibi sınırlı verilere dayanabilir.",
      "illustrations": [
        "Bir otomobil üreticisi, kendi elektrikli araçlarını, çalışma saatlerinden sonra şehirde yaşayan çevre bilincine sahip kullanıcılara tanıtmak ister. Reklam, 18:30'dan sonra, ilgili içerik (iklim değişikliği eylemleri hakkında bir makale gibi) bulunan bir sayfada, kesin olmayan konumu kentsel bir bölge bulunduklarını gösteren kullanıcılara sunulur.",
        "Büyük bir sulu boya üreticisi, en son sulu boya serisi için bir çevrim içi reklam kampanyası düzenlemek, mümkün olduğunca çok amatör ve profesyonel sanatçıya ulaşmak için hedef kitlesini çeşitlendirmek ve reklamı uygun düşmeyen içeriklerin yanında göstermekten kaçınmak ister (örneğin, evinizi nasıl boyayacağınıza dair makaleler). Reklamın çok sık gösterilmemesi için onun size gösterilmiş olduğu sayı tespit edilir ve sınırlandırılır."
      ]
    },
    "3": {
      "name": "Kişiselleştirilmiş reklam için profiller oluşturmak",
      "shortName": "Kişiselleştirilmiş reklam için profil oluşturmak",
      "description": "Bu hizmetteki etkinliğiniz hakkındaki bilgiler (gönderdiğiniz formlar, baktığınız içerik gibi) depolanabilir ve siz veya benzer kullanıcılar hakkındaki diğer bilgilerle (örneğin, bu hizmetteki ve başka web sitelerindeki veya uygulamalardaki önceki etkinliğinizden elde edilen bilgiler) birleştirilebilir. Bunlar daha sonra sizin hakkınızda bir profil oluşturmak veya onu iyileştirmek için kullanılır (olası ilgi alanlarını ve kişisel özellikleri içerebilir). Profiliniz (yine daha sonra) bu ve başka kuruluşlar tarafından olası ilgi alanlarınıza göre daha ilgili görünen reklamlar sunmak için kullanılabilir.",
      "illustrations": [
        "Satın alınacak en iyi bisiklet aksesuarları hakkında birkaç makale okursanız bu bilgiler bisiklet aksesuarlarına duyduğunuz ilgi hakkında bir profil oluşturmak için kullanılabilir. Böyle bir profil daha sonra, size belirli bir bisiklet aksesuarı markası için reklam sunmak üzere aynı veya başka bir web sitesinde veya uygulamada kullanılabilir veya geliştirilebilir. Ayrıca bir lüks otomobil üreticisinin web sitesinde bir araç için bir yapılandırıcıya da bakarsanız bu bilgiler profilinizi iyileştirmek ve lüks bisiklet donanımı ile ilgilendiğinizi varsaymak için bisikletlere olan ilginizle birleştirilebilir.",
        "Bir giyim şirketi yüksek kaliteli yeni bebek kıyafetleri serisini tanıtmak ister. Yüksek gelirli müşterileri olan bir müşteri ağına (üst düzey süpermarketler gibi) sahip olan bir ajans ile iletişime geçer ve ajanstan zengin olduğu ve yeni bir çocuğu olduğu varsayılabilecek genç ebeveynlerin veya çiftlerin profillerini oluşturmasını ister; böylece bu bilgiler daha sonra bu profiller temelinde iş ortağı uygulamaları içinde reklam sunmak için kullanılabilir."
      ]
    },
    "4": {
      "name": "Kişiselleştirilmiş reklam seçmek için profilleri kullanmak",
      "shortName": "Kişiselleştirilmiş reklam göstermek",
      "description": "Bu hizmette size sunulan reklamlar, bu hizmetteki veya başka web sitelerindeki veya uygulamalardaki (gönderdiğiniz formlar, baktığınız içerik gibi) faaliyetlerinizi, olası ilgi alanlarınızı ve kişisel yönlerinizi yansıtabilecek olan reklam profillerinize dayanabilir.",
      "illustrations": [
        "Çevrim içi bir perakendeci, koşu ayakkabılarında sınırlı bir satışın reklamını yapmak ister. Reklamı, daha önce kendi mobil uygulamasında koşu ayakkabılarına bakan kullanıcılara reklam hedeflemek ister. Size uygulamada ilgili reklamlar sunmak amacıyla, daha önce koşu ayakkabılarına bakmak için mobil uygulamayı kullanmış olduğunuzu fark etmek üzere izleme teknolojileri kullanılabilir.",
        "Bir web sitesinde bisiklet aksesuarları aramış olan bir kişi ile ilgili olarak kişiselleştirilmiş reklamlar için oluşturulmuş olan bir profil, başka bir kuruluşun mobil uygulamasında bisiklet aksesuarları için ilgili reklamlar sunmak için kullanılabilir."
      ]
    },
    "5": {
      "name": "İçeriği kişiselleştirmek için profiller oluşturmak",
      "shortName": "Kişiselleştirilmiş içerik için profil oluşturmak",
      "description": "Bu hizmetteki etkinliğiniz hakkındaki bilgiler (örneğin gönderdiğiniz formlar, baktığınız reklam dışı içerik gibi) depolanabilir ve siz veya benzer kullanıcılar hakkındaki diğer bilgilerle (bu hizmetteki ve başka web sitelerindeki veya uygulamalardaki önceki etkinliğiniz gibi) birleştirilebilir. Bunlar daha sonra sizin hakkınızda bir profil oluşturmak veya onu iyileştirmek için kullanılır (bunlar örneğin olası ilgi alanlarını ve kişisel özellikleri içerebilir). Profiliniz (yine daha sonra) olası ilgi alanlarınıza göre daha ilgili görünen içerik sunmak için kullanılabilir, örneğin, ilgi alanlarınıza uyan içeriği daha da kolay bulmanız için içeriğin size gösterilme sırasını uyarlayarak.",
      "illustrations": [
        "Bir sosyal medya platformunda bir ağaç evinin nasıl kurulacağı hakkında birkaç makale okudunuz. Bu bilgiler, dış mekân ile ilgili içeriğe ve kendin yap rehberlerine ilgi duyduğunuz hakkında bir işaret koymak için bir profile eklenebilir (örneğin size gelecekte ağaç evleri ve ahşap kabinler hakkında daha fazla blog yayını ve makalesi sunulması için içeriğin kişiselleştirilmesine olanak vermek amacıyla).",
        "Çeşitli TV uygulamalarında uzay araştırması hakkında üç video izlediniz. Hiç iletişim kurmuş olmadığınız ilgisiz bir haber platformu bu görüntüleme davranışı temelinde bir profil oluşturur ve başka videolar için uzay araştırmasını olası bir ilgi konusu olarak işaretler."
      ]
    },
    "6": {
      "name": "Kişiselleştirilmiş içerik seçmek için profilleri kullanmak",
      "shortName": "Kişiselleştirilmiş içerik göstermek",
      "description": "Bu hizmette size sunulan içerik, bu veya diğer hizmetlerdeki etkinliğinizi (ör. gönderdiğiniz formlar, baktığınız içerik), olası ilgi alanlarınızı ve kişisel yönlerinizi yansıtabilecek içerik kişiselleştirme profillerinize dayalı olabilir. Bu, ilgi alanlarınıza uygun (reklam dışı) içerikleri bulmanızı daha da kolaylaştıracak şekilde, örneğin, içeriklerin size gösterilme sırasını düzenlemek için kullanılabilir.",
      "illustrations": [
        "Bir sosyal medya platformunda vejetaryen yemeklerle ilgili makaleler okudunuz ve sonra ilgisiz bir şirketin yemek pişirme uygulamasını kullandınız. Sosyal medya platformunda sizin hakkınızda oluşturulan profil, yemek pişirme uygulamasının karşılama ekranında size vejetaryen yemek tarifleri göstermek için kullanılacaktır.",
        "Çeşitli web sitelerinde kürek çekme hakkında üç video izlediniz. Çevrim içi videoları izlemek için bu çeşitli web sitelerini ziyaret ettiğiniz zaman hakkınızda oluşturulmuş olan bir profil temelinde, ilgisiz bir video paylaşım platformu, TV uygulamanızı kullandığınızda kürek çekme hakkında ilginizi çekebilecek olan beş video daha önerecektir."
      ]
    },
    "7": {
      "name": "Reklam performansını ölçmek",
      "shortName": "Reklam performansını ölçmek",
      "description": "Size hangi reklamın sunulduğu ve bu reklamla nasıl etkileşim kurduğunuz hakkındaki bilgiler, bir reklamın siz veya başka kullanıcılar için ne kadar işe yaradığını ve reklamın hedeflerine ulaşılıp ulaşılmadığını belirlemek için kullanılabilir. Örneğin, bir reklamı görüp görmediğiniz, ona tıklayıp tıklamadığınız, bunun sizi bir ürün satın almanıza veya bir web sitesini ziyaret etmenize neden olup olmadığı gibi. Bu, reklam kampanyalarının uygunluğunu anlamak için çok yararlıdır.",
      "illustrations": [
        "Bir yayıncının web sitesindeki bir çevrim içi mağaza tarafından “kara Cuma” indirimi hakkında bir reklama tıkladınız ve bir ürün satın aldınız. Tıklamanız, bu satın alma ile ilişkilendirilecektir. Sizin ve diğer kullanıcıların etkileşimi, reklama yapılan kaç tıklamanın bir satın almaya yol açtığını öğrenmek için ölçülecektir.",
        "Bir yayıncının uygulamasındaki çevrim içi bir hediyelik eşya mağazasının “uluslararası şükran günü” indirimi hakkında bir reklama tıklayan çok az sayıdaki kişiden birisiniz. Yayıncı, yayıncının ve iş ortaklarının (acenteler gibi) reklam yerleşimlerini optimize etmesine yardımcı olması için, uygulamanın içindeki belirli bir reklam yerleşiminin ve özellikle “uluslararası şükran günü” reklamının siz ve diğer kullanıcılar tarafından ne sıklıkla görüntülendiğini veya ona tıklandığını anlamak için raporlar almak istemektedir."
      ]
    },
    "8": {
      "name": "İçerik performansını ölçmek",
      "shortName": "İçerik performansını ölçmek",
      "description": "Hangi içeriğin size sunulduğu ve onunla nasıl etkileşime girdiğiniz hakkındaki bilgiler, (reklam dışı) içeriğin örneğin hedef kitlesine ulaşıp ulaşmadığını ve ilgi alanlarınıza uyup uymadığını belirlemek için kullanılabilir. Örneğin bir makale okuyup okumadığınız, video izleyip izlemediğiniz, podcast dinleyip dinlemediğiniz veya bir ürün açıklamasına bakıp bakmadığınız, bu hizmette ne kadar zaman harcadığınız ve ziyaret ettiğiniz web sayfaları vb. Bu, size gösterilen (reklam dışı) içeriğin uygunluğunu anlamak için çok yararlıdır.",
      "illustrations": [
        "Bir yayıncının mobil uygulamasında doğa yürüyüşü hakkında bir blog yayını okudunuz ve önerilen ve ilgili bir yanının bağlantısını takip ettiniz. Etkileşimleriniz, ilk doğa yürüyüşü yayının sizin için yararlı olduğunu ve ilgili yayında ilginizi çekmekte başarılı olduğunu gösterdiği şeklinde kaydedilecektir. Bu, ileride doğa yürüyüşü hakkında daha çok yayın üretip üretilmeyeceğini ve bunların mobil uygulamanın ana ekranında nereye yerleştirileceğini bilmek için ölçülecektir.",
        "Size moda trendleri hakkında bir video sunulmuştur ama siz ve birkaç başka kullanıcı 30 saniye sonra izlemeyi bırakırsınız. Bu bilgiler böylece moda trendleri hakkında ilerideki videoların doğru uzunluğunu değerlendirmek için kullanılır."
      ]
    },
    "9": {
      "name": "İstatistikler veya farklı kaynaklardan gelen verilerin bileşimleri yoluyla hedef kitleleri anlamak",
      "shortName": "Kitlemizi istatistiklerle anlamak",
      "description": "Ortak özellikleri (örneğin bir reklam kampanyasına veya belirli içeriklere hangi hedef kitlelerin daha açık olduğunu belirlemek için) belirlemek için, sizin ve diğer kullanıcıların reklamlar veya (reklam dışı) içerik ile etkileşimlerine ilişkin veri kümelerinin (kullanıcı profilleri, istatistikler, pazar araştırması, analiz verileri gibi) birleşimi temelinde raporlar oluşturulabilir.",
      "illustrations": [
        "Çevrim içi bir kitabevinin sahibi, sitesine bakıp satın alma yapmadan ayrılan veya bakıp o ayın en yeni ünlü kişi otobiyografisini satın alan ziyaretçilerin oranını ve her kategorinin yaş ortalamasını ve erkek/kadın dağılımını gösteren ticari rapor istemektedir. Onun sitesinde gezinmenizle ve kişisel özelliklerinizle ilgili veriler böylece bu istatistikleri oluşturmak için kullanılır ve bu gibi başka verilerle birleştirilir.",
        "Bir reklam veren, onun reklamlarıyla etkileşime giren kitlenin türünü daha iyi anlamak istemektedir. Çeşitli cihazlar ile reklamla etkileşime girmiş olan kullanıcıların özelliklerini benzer platformların kullanıcılarının tipik özellikleri ile karşılaştırmak için bir araştırma enstitüsünü arar. Bu karşılaştırma, reklam verene, onun reklam hedef kitlesinin reklamlara esas olarak mobil cihazlar aracılığıyla eriştiğini ve muhtemelen 45-60 yaş aralığında olduğunu gösterir."
      ]
    },
    "10": {
      "name": "Hizmetleri geliştirmek ve iyileştirmek",
      "shortName": "Hizmetlerimizi iyileştirmek",
      "description": "Reklamlar veya içerik ile etkileşiminiz gibi bu hizmetteki etkinliğiniz hakkındaki bilgiler, kullanıcı etkileşimlerine, hedef kitlenin türüne vb. dayalı olarak ürünleri ve hizmetleri iyileştirmek ve yeni ürünler ve hizmetler oluşturmak için çok yararlı olabilir. Bu özel amaç, kullanıcı profilleri ve tanımlayıcılar geliştirilmesini veya iyileştirilmesini içermez.",
      "illustrations": [
        "Bir sosyal medya sağlayıcısı ile çalışan bir teknoloji platformu mobil uygulama kullanıcılarında bir artış fark eder ve bunların profilleri temelinde bunların birçoğunun mobil bağlantılar aracılığıyla bağlandığını görür. Kendi performansını artırmak için, mobil cihazlar için biçimlendirilmiş olan ve düşük bant genişliğine sahip olan reklamlar sunmak için yeni bir teknoloji kullanır.",
        "Bir reklam veren, reklamlarını yeni bir tüketici cihazında görüntülemenin bir yolunu aramaktadır. Bu tür bir cihazda reklam görüntülemek için yeni bir mekanizma oluşturup oluşturamayacağını belirlemek üzere kullanıcıların bu yeni tür cihazla etkileşim yolları hakkında bilgi toplar."
      ]
    },
    "11": {
      "name": "İçerik seçmek için sınırlı veri kullanmak",
      "shortName": "Sınırlı verilere dayalı içerik göstermek",
      "description": "Bu hizmette size sunulan içerik, kullandığınız web sitesi veya uygulama, kesin olmayan konumunuz, cihaz türünüz veya etkileşimde bulunuyor olduğunuz (veya bulunduğunuz) içerik (örneğin size bir videonun veya makalenin sunulma sayısını sınırlamak için) gibi sınırlı verilere dayanabilir.",
      "illustrations": [
        "Bir seyahat dergisi, yurt dışındaki seyahat deneyimlerini iyileştirmek için bir dil okulu tarafından önerilen yeni çevrim içi kurslar hakkında kendi web sitesinde bir makale yayınlamıştır. Okulun blog yayınları doğrudan sayfanın altına eklenmiş ve kesin olmayan konumunuza göre seçilmiştir (örneğin, bulunduğunuz ülkenin dilinden farklı diller için kurs müfredatını açıklayan blog yayınları).",
        "Bir spor haberleri mobil uygulaması, en son futbol maçlarını kapsayan yeni bir makale bölümü başlatmıştır. Her makale, ayrı bir yayın platformu tarafından barındırılan ve her maçın önemli yönlerini gösteren videolar içermektedir. Bir videoyu hızla ileriye aldığınız takdirde bu bilgi bunun ardından oynatmak için daha kısa bir video seçmek için kullanılabilmektedir."
      ]
    }
  },
  "specialFeatures": {
    "1": {
      "name": "Kesin coğrafi konum verilerini kullanmak",
      "description": "Sizin kabulünüz ile, bu bildirimde açıklanan amaçları desteklemek için kesin konumunuz (500 metreden az bir yarıçap içinde) kullanılabilir.",
      "illustrations": []
    },
    "2": {
      "name": "Aktif olarak talep edilen bilgilere dayanarak cihazları belirlemek",
      "description": "Bu bildirimde açıklanan amaçları desteklemek amacıyla, sizin kabulünüzle, cihazınıza özgü belirli özellikler talep edilebilir ve onu diğer cihazlardan (yüklü yazı tipleri veya eklentiler, ekranınızın çözünürlüğü gibi) ayırt etmek için kullanılabilir.",
      "illustrations": []
    }
  },
  "dataCategories": {
    "1": "IP adresleri",
    "2": "Cihaz özellikleri",
    "3": "Cihaz tanımlayıcılar",
    "4": "Olasılıksal tanımlayıcılar",
    "5": "Kimlik doğrulama ile türetilen tanımlayıcılar",
    "6": "Tarama ve etkileşim verileri",
    "7": "Kullanıcı tarafından sağlanan veriler",
    "8": "Kesin olmayan konum verileri",
    "9": "Kesin konum verileri",
    "10": "Kullanıcı profilleri",
    "11": "Gizlilik seçenekleri"
  },
  "stacks": {
    "2": "Sınırlı veriye ve reklam ölçümüne dayalı reklamlar",
    "3": "Kişiselleştirilmiş reklamlar",
    "4": "Sınırlı veriye, reklam ölçümüne ve hedef kitle araştırmasına dayalı reklamlar",
    "5": "Sınırlı veriye, kişiselleştirilmiş reklam profiline ve reklam ölçümüne dayalı reklamlar",
    "6": "Kişiselleştirilmiş reklamların seçilmesi ve reklam ölçümü",
    "7": "Kişiselleştirilmiş reklamların seçilmesi, reklam ölçümü ve hedef kitle araştırması",
    "8": "Kişiselleştirilmiş reklam ve reklam ölçümü",
    "9": "Kişiselleştirilmiş reklam, reklam ölçümü ve hedef kitle araştırması",
    "10": "Kişiselleştirilmiş reklamlar",
    "11": "Kişiselleştirilmiş içerik",
    "12": "Kişiselleştirilmiş içeriğin seçilmesi ve içerik ölçümü",
    "13": "Kişiselleştirilmiş içeriğin seçilmesi, içerik ölçümü ve hedef kitle araştırması",
    "14": "Kişiselleştirilmiş içerik ve içerik ölçümü",
    "15": "Kişiselleştirilmiş içerik, içerik ölçümü ve hedef kitle araştırması",
    "16": "Kişiselleştirilmiş içerik, içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "17": "Reklam ve içerik ölçümü ve hedef kitle araştırması",
    "18": "Reklam ve içerik ölçümü",
    "19": "Reklam ölçümü ve hedef kitle araştırması",
    "20": "Reklam ve içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "21": "İçerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi.",
    "22": "İçerik ölçümü ve hizmetlerin geliştirilmesi",
    "23": "Kişiselleştirilmiş reklam ve içerik seçilmesi, reklam ve içerik ölçümü",
    "24": "Kişiselleştirilmiş reklam ve içerik seçilmesi, reklam ve içerik ölçümü ve hedef kitle araştırması",
    "25": "Kişiselleştirilmiş reklamlar ve içerik, reklam ve içerik ölçümü",
    "26": "Kişiselleştirilmiş reklam ve içerik, reklam ve içerik ölçümü ve hedef kitle araştırması",
    "27": "Kişiselleştirilmiş reklam ve içerik profili",
    "28": "Kişiselleştirilmiş reklam ve içerik seçilmesi",
    "29": "Sınırlı veriye, reklam ve içerik ölçümüne ve hedef kitle araştırmasına dayalı reklamlar",
    "30": "Kişiselleştirilmiş reklam, kişiselleştirilmiş içerik seçilmesi, reklam ve içerik ölçümü ve hedef kitle araştırması",
    "31": "Kişiselleştirilmiş reklam, kişiselleştirilmiş içerik seçme, reklam ve içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "32": "Sınırlı veriye, kişiselleştirilmiş içeriğe, reklam ve içerik ölçümüne ve hedef kitle araştırmasına dayalı reklamlar",
    "33": "Sınırlı veriye, kişiselleştirilmiş içeriğe, reklam ve içerik ölçümüne, hedef kitle araştırmasına ve hizmetlerin geliştirilmesine dayalı reklamlar",
    "34": "Sınırlı verilere, kişiselleştirilmiş içeriğe, içerik ölçümüne ve hedef kitle araştırmasına dayalı reklamlar",
    "35": "Sınırlı verilere, kişiselleştirilmiş içeriğe, içerik ölçümüne, hedef kitle araştırmasına ve hizmetlerin geliştirilmesine dayalı reklamlar",
    "36": "Sınırlı veriye, kişiselleştirilmiş içeriğe ve reklam ölçümüne dayalı reklamlar",
    "37": "Sınırlı veriye, kişiselleştirilmiş içeriğe, reklam ölçümüne ve hizmetlerin geliştirilmesine dayalı reklamlar",
    "38": "Kişiselleştirilmiş reklam, reklam ölçümü ve hizmetlerin geliştirilmesi",
    "39": "Kişiselleştirilmiş reklam, reklam ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "40": "Kişiselleştirilmiş reklam, reklam ve içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "41": "Kişiselleştirilmiş reklam, kişiselleştirilmiş içerik seçilmesi, reklam ve içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "42": "Kişiselleştirilmiş reklam ve içerik, reklam ve içerik ölçümü, hedef kitle araştırması ve hizmetlerin geliştirilmesi",
    "43": "Sınırlı veriye ve içerik ölçümüne dayalı içerik",
    "44": "Kişiselleştirilmiş içerik",
    "45": "Sınırlı veriye, reklam ölçümüne, hedef kitle araştırmasına ve hizmetlerin geliştirilmesine dayalı reklamlar",
    "1": "Kesin coğrafi konum verileri ve cihaz tarama vasıtası ile kimlik belirleme"
  },
  "stackSummaries": {
    "26": "Kişiselleştirilmiş reklam ve içerik ile bunların performansının ölçülmesi",
    "42": "Kişiselleştirilmiş reklam ve içerik, bunların performansının ölçülmesi ve hizmetlerimizin iyileştirilmesi"
  }
};
