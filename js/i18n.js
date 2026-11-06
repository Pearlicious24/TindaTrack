/* ---------- Language: English / Filipino / Cebuano ----------
   The app is written in English. This layer translates everything on screen
   (pages, menus, pop-ups, toasts, chart labels, placeholders) into the
   language picked in Profile → Settings → Language. */

const LANGS = { English: 'en', Filipino: 'fil', Cebuano: 'ceb' };

/* English → [Filipino, Cebuano] */
const DICT = {
  // Navigation + top bar
  'Home': ['Tahanan', 'Panimalay'],
  'Products': ['Mga Produkto', 'Mga Produkto'],
  'Inventory': ['Imbentaryo', 'Imbentaryo'],
  'Utang Ledger': ['Listahan ng Utang', 'Listahan sa Utang'],
  'Profile': ['Profile', 'Profile'],
  'Search a product': ['Maghanap ng produkto', 'Pangitaa ang produkto'],
  'Search categories': ['Maghanap ng kategorya', 'Pangitaa ang kategorya'],
  'Search a customer': ['Maghanap ng customer', 'Pangitaa ang customer'],
  'Search': ['Maghanap', 'Pangita'],
  'Notifications': ['Mga Abiso', 'Mga Pahibalo'],
  'Unlock sales analytics and stock forecasting with Premium.': ['I-unlock ang sales analytics at stock forecasting gamit ang Premium.', 'I-unlock ang sales analytics ug stock forecasting gamit ang Premium.'],
  'Upgrade to Premium': ['Mag-upgrade sa Premium', 'Mag-upgrade sa Premium'],
  'Welcome': ['Maligayang pagdating', 'Maayong pag-abot'],
  'Log in': ['Mag-log in', 'Mag-log in'],

  // Dashboard
  'Sales overview': ['Buod ng benta', 'Kinatibuk-ang baligya'],
  'vs yesterday': ['kumpara kahapon', 'kumpara gahapon'],
  'vs previous 7 days': ['kumpara sa nakaraang 7 araw', 'kumpara sa miaging 7 ka adlaw'],
  'vs previous 14 days': ['kumpara sa nakaraang 14 araw', 'kumpara sa miaging 14 ka adlaw'],
  'vs previous month': ['kumpara sa nakaraang buwan', 'kumpara sa miaging bulan'],
  'vs previous 3 months': ['kumpara sa nakaraang 3 buwan', 'kumpara sa miaging 3 ka bulan'],
  'vs previous year': ['kumpara sa nakaraang taon', 'kumpara sa miaging tuig'],
  "Today's sales": ['Benta ngayong araw', 'Baligya karong adlawa'],
  'Utang to collect': ['Utang na sisingilin', 'Utang nga kolektahon'],
  'pending balance': ['hindi pa bayad', 'wala pa mabayri'],
  'Low stock': ['Paubos na', 'Hapit na mahurot'],
  'View all': ['Tingnan lahat', 'Tan-awa tanan'],
  'Out of stock': ['Ubos na', 'Hurot na'],
  'All products are well stocked. 🎉': ['Sapat ang stock ng lahat ng produkto. 🎉', 'Igo ang stock sa tanang produkto. 🎉'],

  // Chart groups + categories
  'Beverages': ['Inumin', 'Ilimnon'],
  'Snacks': ['Meryenda', 'Sitsiriya'],
  'Canned & Noodles': ['De-lata at Noodles', 'De-lata ug Noodles'],
  'Personal Care': ['Pansariling Kalinga', 'Personal nga Atiman'],
  'Canned Goods': ['De-lata', 'De-lata'],
  'Instant Noodles': ['Instant Noodles', 'Instant Noodles'],
  'Biscuits': ['Biskwit', 'Biskwit'],
  'Pantry': ['Pangluto', 'Panluto'],
  'Beverages & Instant Coffee': ['Inumin at Instant na Kape', 'Ilimnon ug Instant nga Kape'],
  'Personal Care & Hygiene': ['Pansariling Kalinga at Kalinisan', 'Personal nga Atiman ug Kalimpyo'],
  'Canned Goods & Preserves': ['De-lata at Preserbado', 'De-lata ug Preserbado'],
  'Instant Noodles & Pasta': ['Instant Noodles at Pasta', 'Instant Noodles ug Pasta'],
  'Snacks & Chips': ['Meryenda at Sitsirya', 'Snacks ug Sitsiriya'],
  'Biscuits & Sweets': ['Biskwit at Matatamis', 'Biskwit ug Tam-is'],
  'Pantry & Cooking': ['Pangluto at Pantry', 'Panluto ug Pantry'],

  // Products
  'Tap the red button to record a sale.': ['Pindutin ang pulang button para itala ang benta.', 'Pindota ang pula nga button aron itala ang baligya.'],
  'Add product': ['Magdagdag ng produkto', 'Pagdugang og produkto'],
  'All': ['Lahat', 'Tanan'],
  'Product name': ['Pangalan ng produkto', 'Ngalan sa produkto'],
  'Category': ['Kategorya', 'Kategorya'],
  'Price (₱)': ['Presyo (₱)', 'Presyo (₱)'],
  'Starting stock': ['Panimulang stock', 'Sinugdanang stock'],
  'Edit product': ['I-edit ang produkto', 'Usba ang produkto'],
  'Product photo': ['Litrato ng produkto', 'Litrato sa produkto'],
  'Take or choose photo': ['Kumuha o pumili ng litrato', 'Pagkuha o pagpili og litrato'],
  'Remove photo': ['Alisin ang litrato', 'Tangtanga ang litrato'],
  'A clear photo on a plain background works best.': ['Mas maganda ang malinaw na litrato sa simpleng background.', 'Mas maayo ang klaro nga litrato sa yano nga background.'],
  'Or use a drawing': ['O gumamit ng drawing', 'O gamita ang drawing'],
  'Drawings': ['Mga drawing', 'Mga drawing'],
  'Stock': ['Stock', 'Stock'],
  'Product saved': ['Na-save ang produkto', 'Na-save ang produkto'],
  'Photo not added': ['Hindi naidagdag ang litrato', 'Wala nadugang ang litrato'],
  'That file isn’t a picture we can open. Try a JPG or PNG.': ['Hindi mabuksan ang file na iyan bilang litrato. Subukan ang JPG o PNG.', 'Dili maablihan ang file isip litrato. Sulayi ang JPG o PNG.'],
  'Enter a product name.': ['Ilagay ang pangalan ng produkto.', 'Isulod ang ngalan sa produkto.'],
  'Enter a valid price.': ['Maglagay ng tamang presyo.', 'Pagsulod og saktong presyo.'],
  'Enter a valid stock count.': ['Maglagay ng tamang bilang ng stock.', 'Pagsulod og saktong ihap sa stock.'],
  'Product added': ['Naidagdag ang produkto', 'Nadugang ang produkto'],
  'Product limit reached': ['Naabot na ang limit ng produkto', 'Naabot na ang limit sa produkto'],
  'Sale recorded': ['Naitala ang benta', 'Natala ang baligya'],

  // Inventory
  'Manage stock by category.': ['Pamahalaan ang stock ayon sa kategorya.', 'Dumalaha ang stock sumala sa kategorya.'],
  'Add category': ['Magdagdag ng kategorya', 'Pagdugang og kategorya'],
  'Edit': ['I-edit', 'Usba'],
  'Add stock': ['Magdagdag ng stock', 'Pagdugang og stock'],
  'Edit category': ['I-edit ang kategorya', 'Usba ang kategorya'],
  'Save changes': ['I-save ang mga pagbabago', 'I-save ang mga kausaban'],
  'Category name': ['Pangalan ng kategorya', 'Ngalan sa kategorya'],
  'Short label': ['Maikling label', 'Mubo nga label'],
  'Chart group': ['Grupo sa chart', 'Grupo sa chart'],
  'Products in this category': ['Mga produkto sa kategoryang ito', 'Mga produkto niini nga kategorya'],
  'None yet.': ['Wala pa.', 'Wala pa.'],
  'Add product here': ['Magdagdag ng produkto dito', 'Pagdugang og produkto diri'],
  'Remove product': ['Alisin ang produkto', 'Tangtanga ang produkto'],
  'Click again to remove': ['I-click ulit para alisin', 'I-click pag-usab aron tangtangon'],
  'Remove?': ['Alisin?', 'Tangtangon?'],
  'Enter a category name.': ['Ilagay ang pangalan ng kategorya.', 'Isulod ang ngalan sa kategorya.'],
  'Category saved': ['Na-save ang kategorya', 'Na-save ang kategorya'],
  'Category added': ['Naidagdag ang kategorya', 'Nadugang ang kategorya'],
  'Product removed': ['Naalis ang produkto', 'Natangtang ang produkto'],
  'Product': ['Produkto', 'Produkto'],
  'Quantity received': ['Dami ng natanggap', 'Gidaghanon nga nadawat'],
  'Enter a quantity of at least 1.': ['Maglagay ng dami na hindi bababa sa 1.', 'Pagsulod og gidaghanon nga dili moubos sa 1.'],
  'Stock added': ['Naidagdag ang stock', 'Nadugang ang stock'],

  // Utang Ledger
  'Track who owes you and send reminders.': ['Subaybayan kung sino ang may utang at magpadala ng paalala.', 'Bantayi kinsa ang adunay utang ug padalhi og pahinumdom.'],
  'New utang': ['Bagong utang', 'Bag-ong utang'],
  'To collect': ['Sisingilin', 'Kolektahon'],
  'Overdue': ['Lampas na', 'Lapas na'],
  'All balances on time': ['Lahat ng balanse ay nasa oras', 'Tanang balanse naa sa oras'],
  'Customers': ['Mga customer', 'Mga customer'],
  'Pending': ['Nakabinbin', 'Naghulat'],
  'Paid': ['Bayad na', 'Bayad na'],
  'No mobile number': ['Walang mobile number', 'Walay mobile number'],
  'Record Payment': ['Itala ang Bayad', 'Itala ang Bayad'],
  'Send SMS': ['Magpadala ng SMS', 'Padala og SMS'],
  'No customers here.': ['Walang customer dito.', 'Walay customer diri.'],
  'Auto SMS reminders': ['Awtomatikong SMS na paalala', 'Awtomatikong SMS nga pahinumdom'],
  'On': ['Naka-on', 'Naka-on'],
  'Off': ['Naka-off', 'Naka-off'],
  'Manage': ['Pamahalaan', 'Dumalaha'],
  'Edit customer': ['I-edit ang customer', 'Usba ang customer'],
  'Add a balance for a new or existing customer.': ['Magdagdag ng balanse para sa bago o dating customer.', 'Pagdugang og balanse para sa bag-o o karaang customer.'],
  'Save utang': ['I-save ang utang', 'I-save ang utang'],
  'Customer name': ['Pangalan ng customer', 'Ngalan sa customer'],
  'Mobile number (required for SMS reminders)': ['Mobile number (kailangan para sa SMS na paalala)', 'Mobile number (kinahanglan para sa SMS nga pahinumdom)'],
  'Items': ['Mga item', 'Mga butang'],
  'Amount (₱)': ['Halaga (₱)', 'Kantidad (₱)'],
  'Enter the customer name.': ['Ilagay ang pangalan ng customer.', 'Isulod ang ngalan sa customer.'],
  'Enter the customer’s mobile number so you can send SMS reminders.': ['Ilagay ang mobile number ng customer para makapagpadala ng SMS na paalala.', 'Isulod ang mobile number sa customer aron makapadala og SMS nga pahinumdom.'],
  'Enter a valid PH mobile number, e.g. 912 345 6789.': ['Maglagay ng tamang PH mobile number, hal. 912 345 6789.', 'Pagsulod og saktong PH mobile number, pananglitan 912 345 6789.'],
  'Enter an amount greater than 0.': ['Maglagay ng halagang higit sa 0.', 'Pagsulod og kantidad nga labaw sa 0.'],
  'Utang saved': ['Na-save ang utang', 'Na-save ang utang'],
  'Customer saved': ['Na-save ang customer', 'Na-save ang customer'],
  'Record payment': ['Itala ang bayad', 'Itala ang bayad'],
  'Amount paid (₱)': ['Halagang ibinayad (₱)', 'Kantidad nga gibayad (₱)'],
  'Full': ['Buo', 'Tanan'],
  'Payment recorded': ['Naitala ang bayad', 'Natala ang bayad'],
  'Fully paid': ['Bayad na lahat', 'Bayad na tanan'],
  'Send SMS reminder': ['Magpadala ng SMS na paalala', 'Padala og SMS nga pahinumdom'],
  'Send to': ['Ipadala sa', 'Ipadala sa'],
  'This customer has no number yet — add one to send the reminder.': ['Wala pang number ang customer na ito — magdagdag para maipadala ang paalala.', 'Wala pay number kining customer — pagdugang aron mapadala ang pahinumdom.'],
  'Message': ['Mensahe', 'Mensahe'],
  "This demo doesn't send real texts — connect an SMS gateway to go live.": ['Hindi nagpapadala ng totoong text ang demo na ito — ikonekta ang SMS gateway para gumana.', 'Dili mopadala og tinuod nga text kining demo — ikonektar ang SMS gateway aron mugana.'],
  'The message is empty.': ['Walang laman ang mensahe.', 'Walay sulod ang mensahe.'],
  'SMS sent': ['Naipadala ang SMS', 'Napadala ang SMS'],

  // Profile
  'Your account and store settings.': ['Ang iyong account at mga setting ng tindahan.', 'Imong account ug mga setting sa tindahan.'],
  'Edit profile': ['I-edit ang profile', 'Usba ang profile'],
  'Settings': ['Mga Setting', 'Mga Setting'],
  'Text customers with overdue utang': ['I-text ang mga customer na lampas na ang utang', 'I-text ang mga customer nga lapas na ang utang'],
  'Language': ['Wika', 'Pinulongan'],
  'App language': ['Wika ng app', 'Pinulongan sa app'],
  'Low-stock alert': ['Alerto sa paubos na stock', 'Alerto sa hapit mahurot'],
  'Warn when stock is below this': ['Magbabala kapag mas mababa rito ang stock', 'Pahibaw-a kung ubos niini ang stock'],
  'Remind after (days)': ['Magpaalala pagkalipas ng (araw)', 'Pahinumdom human sa (adlaw)'],
  'Days a balance stays unpaid before an SMS': ['Ilang araw na hindi bayad bago mag-SMS', 'Pila ka adlaw nga wala mabayri una mo-SMS'],
  '₱199/month · Inventory, sales logging, utang ledger with SMS reminders, and daily & weekly profit reports.': ['₱199/buwan · Imbentaryo, pagtatala ng benta, listahan ng utang na may SMS na paalala, at araw-araw at lingguhang ulat ng kita.', '₱199/bulan · Imbentaryo, pagtala sa baligya, listahan sa utang nga adunay SMS nga pahinumdom, ug adlaw-adlaw ug semana-semana nga report sa ginansya.'],
  'See Premium Features': ['Tingnan ang Premium Features', 'Tan-awa ang Premium Features'],
  'Account': ['Account', 'Account'],
  'Log out': ['Mag-log out', 'Mag-log out'],
  'Reset demo data': ['I-reset ang demo data', 'I-reset ang demo data'],
  'Log out?': ['Mag-log out?', 'Mag-log out?'],
  'You can log back in anytime with your mobile number. Your data stays on this device.': ['Puwede kang mag-log in ulit anumang oras gamit ang iyong mobile number. Mananatili ang iyong data sa device na ito.', 'Makalog-in ka pag-usab bisan kanus-a gamit ang imong mobile number. Magpabilin ang imong data niini nga device.'],
  'Reset demo data?': ['I-reset ang demo data?', 'I-reset ang demo data?'],
  'This restores the sample products, customers and sales, and takes you back to onboarding.': ['Ibabalik nito ang mga sample na produkto, customer at benta, at babalik ka sa simula.', 'Ibalik niini ang mga sample nga produkto, customer ug baligya, ug mobalik ka sa sinugdanan.'],
  'Reset': ['I-reset', 'I-reset'],
  'Owner name': ['Pangalan ng may-ari', 'Ngalan sa tag-iya'],
  'Store name': ['Pangalan ng tindahan', 'Ngalan sa tindahan'],
  'Location': ['Lokasyon', 'Lokasyon'],
  'This field is required.': ['Kailangan ang field na ito.', 'Kinahanglan kini nga field.'],
  'Profile updated.': ['Na-update ang profile.', 'Na-update ang profile.'],
  'Saved': ['Na-save', 'Na-save'],
  'Settings saved': ['Na-save ang mga setting', 'Na-save ang mga setting'],
  'Auto SMS reminders turned on.': ['Naka-on na ang awtomatikong SMS na paalala.', 'Naka-on na ang awtomatikong SMS nga pahinumdom.'],
  'Auto SMS reminders turned off.': ['Naka-off na ang awtomatikong SMS na paalala.', 'Naka-off na ang awtomatikong SMS nga pahinumdom.'],
  'Decrease': ['Bawasan', 'Kuhaan'],
  'Increase': ['Dagdagan', 'Dugangi'],

  // Shared
  'Cancel': ['Kanselahin', 'Kanselaha'],
  'Save': ['I-save', 'I-save'],
  'Close': ['Isara', 'Sirad-i'],
  'Dismiss': ['Isara', 'Sirad-i'],
  'Heads up': ['Paalala', 'Pahibalo'],
  'Done': ['Tapos na', 'Nahuman'],
  'Mobile number': ['Mobile number', 'Mobile number'],

  // Plans
  'Subscription Plans': ['Mga Plano ng Subscription', 'Mga Plano sa Subscription'],
  'Choose the plan that fits your tindahan.': ['Piliin ang planong bagay sa iyong tindahan.', 'Pilia ang plano nga haom sa imong tindahan.'],
  'Current plan': ['Kasalukuyang plano', 'Kasamtangang plano'],
  'Recommended': ['Inirerekomenda', 'Girekomendar'],
  'For sari-sari stores getting organized.': ['Para sa mga sari-sari store na gustong maging organisado.', 'Para sa mga sari-sari store nga gustong mahan-ay.'],
  'Everything in Standard, plus:': ['Lahat ng nasa Standard, dagdag pa ang:', 'Tanan sa Standard, dugang pa ang:'],
  '/ month': ['/ buwan', '/ bulan'],
  'Core inventory management': ['Pangunahing pamamahala ng imbentaryo', 'Panguna nga pagdumala sa imbentaryo'],
  'Track products and stock levels.': ['Subaybayan ang mga produkto at dami ng stock.', 'Bantayi ang mga produkto ug gidaghanon sa stock.'],
  'Sales logging': ['Pagtatala ng benta', 'Pagtala sa baligya'],
  'Record every sale in one tap.': ['Itala ang bawat benta sa isang pindot.', 'Itala ang matag baligya sa usa ka pindot.'],
  'Digital credit ledger': ['Digital na listahan ng utang', 'Digital nga listahan sa utang'],
  'Utang tracking with SMS reminders.': ['Pagsubaybay ng utang na may SMS na paalala.', 'Pagbantay sa utang nga adunay SMS nga pahinumdom.'],
  'Profit reports': ['Ulat ng kita', 'Report sa ginansya'],
  'Daily and weekly profit summaries.': ['Araw-araw at lingguhang buod ng kita.', 'Adlaw-adlaw ug semana-semana nga summary sa ginansya.'],
  'Expanded storage': ['Mas malaking storage', 'Mas dako nga storage'],
  'Room for larger product inventories, suitable for minimarts.': ['Kasya ang mas maraming produkto, bagay sa mga minimart.', 'Igo sa mas daghang produkto, haom sa mga minimart.'],
  'Visual sales analytics': ['Biswal na sales analytics', 'Biswal nga sales analytics'],
  'A dashboard that shows how your sales are trending.': ['Dashboard na nagpapakita ng takbo ng iyong benta.', 'Dashboard nga nagpakita sa dagan sa imong baligya.'],
  'Intelligent stock forecasting': ['Matalinong pagtataya ng stock', 'Maalamon nga pagtag-an sa stock'],
  'Know what to restock before it runs out.': ['Alamin kung ano ang dapat i-restock bago maubos.', 'Hibal-i kung unsa ang i-restock sa dili pa mahurot.'],
  'Upgrade to Premium — ₱299/month': ['Mag-upgrade sa Premium — ₱299/buwan', 'Mag-upgrade sa Premium — ₱299/bulan'],
  'Coming soon': ['Malapit na', 'Hapit na'],
  'Payments are not connected in this demo yet.': ['Hindi pa konektado ang bayad sa demo na ito.', 'Wala pa makonektar ang bayad niini nga demo.'],
  'No notifications yet.': ['Wala pang abiso.', 'Wala pay pahibalo.'],
  'Clear all': ['Burahin lahat', 'Papasa tanan'],

  // Onboarding
  'Welcome to': ['Maligayang pagdating sa', 'Maayong pag-abot sa'],
  "We're thrilled to have you on board! TindaTrack is designed specifically for sari-sari store and minimart owners like you to make managing your daily operations fast, effortless, and organized.": ['Masaya kaming kasama ka! Ginawa ang TindaTrack para sa mga may-ari ng sari-sari store at minimart na tulad mo, para maging mabilis, madali, at organisado ang pamamahala ng iyong araw-araw na operasyon.', 'Malipayon kami nga kauban ka! Gihimo ang TindaTrack para sa mga tag-iya sa sari-sari store ug minimart sama nimo, aron paspas, sayon, ug hapsay ang pagdumala sa imong adlaw-adlaw nga operasyon.'],
  'Record sales': ['Itala ang benta', 'Itala ang baligya'],
  'In one tap.': ['Sa isang pindot.', 'Sa usa ka pindot.'],
  'Tap a product to log a sale. Stock updates automatically, and your dashboard shows how the day is going.': ['Pindutin ang produkto para itala ang benta. Kusang naa-update ang stock, at makikita sa dashboard ang takbo ng araw.', 'Pindota ang produkto aron itala ang baligya. Awtomatikong ma-update ang stock, ug makita sa dashboard ang dagan sa adlaw.'],
  'Never forget': ['Huwag kalimutan', 'Ayaw kalimti'],
  'Any utang.': ['Ang anumang utang.', 'Bisan unsang utang.'],
  'Keep a clean ledger of who owes what, record payments, and send friendly SMS reminders.': ['Panatilihing maayos ang listahan ng may utang, itala ang mga bayad, at magpadala ng magiliw na SMS na paalala.', 'Hupti nga hapsay ang listahan sa adunay utang, itala ang mga bayad, ug padalhi og buotan nga SMS nga pahinumdom.'],
  'Stay stocked': ['Laging may stock', 'Kanunay adunay stock'],
  'Get alerts.': ['Makatanggap ng alerto.', 'Makadawat og alerto.'],
  "See what's running low before it runs out, so your suki always find what they need.": ['Alamin kung ano ang paubos na bago tuluyang maubos, para laging may mabili ang iyong mga suki.', 'Hibal-i kung unsa ang hapit na mahurot, aron kanunay makapalit ang imong mga suki sa ilang kinahanglan.'],
  'Get Started': ['Magsimula', 'Magsugod'],

  // Login
  'Track every sale.': ['Itala ang bawat benta.', 'Itala ang matag baligya.'],
  'Manage every utang.': ['Pamahalaan ang bawat utang.', 'Dumalaha ang matag utang.'],
  'Inventory, sales and utang for your sari-sari store, all in one place.': ['Imbentaryo, benta at utang ng iyong sari-sari store, nasa iisang lugar.', 'Imbentaryo, baligya ug utang sa imong sari-sari store, anaa sa usa ka lugar.'],
  'Welcome back': ['Maligayang pagbabalik', 'Maayong pagbalik'],
  'Log in with your mobile number to continue.': ['Mag-log in gamit ang iyong mobile number para magpatuloy.', 'Mag-log in gamit ang imong mobile number aron mopadayon.'],
  'Verification code': ['Verification code', 'Verification code'],
  '6-digit code': ['6-digit na code', '6-digit nga code'],
  'Demo mode: use code': ['Demo mode: gamitin ang code', 'Demo mode: gamita ang code'],
  'Continue': ['Magpatuloy', 'Padayon'],
  'Verify & log in': ['I-verify at mag-log in', 'I-verify ug mag-log in'],
  'By continuing, you agree to the Terms of Service and Privacy Policy of TindaTrack.': ['Sa pagpapatuloy, sumasang-ayon ka sa Terms of Service at Privacy Policy ng TindaTrack.', 'Sa pagpadayon, miuyon ka sa Terms of Service ug Privacy Policy sa TindaTrack.'],
  'Code sent': ['Naipadala ang code', 'Napadala ang code'],
  'Incorrect code. Try 123456.': ['Mali ang code. Subukan ang 123456.', 'Sayop ang code. Sulayi ang 123456.'],
};

/* Sentences with numbers or names in them: [pattern, Filipino, Cebuano] */
const PATTERNS = [
  [/^Only (\d+) left$/, '$1 na lang ang natitira', '$1 na lang ang nahabilin'],
  [/^(\d+) in stock$/, '$1 ang stock', '$1 ang stock'],
  [/^(\d+) left$/, '$1 na lang', '$1 na lang'],
  [/^(\d+) units in stock$/, '$1 piraso ang stock', '$1 ka buok ang stock'],
  [/^(\d+) customers?$/, '$1 customer', '$1 ka customer'],
  [/^(\d+) customers? with balance$/, '$1 customer na may balanse', '$1 ka customer nga adunay balanse'],
  [/^Unpaid over (\d+) days$/, 'Hindi bayad nang higit $1 araw', 'Wala mabayri sobra $1 ka adlaw'],
  [/^Here's how (.+) is doing\.$/, 'Ganito ang takbo ng $1.', 'Mao kini ang dagan sa $1.'],
  [/^(\d+) products? · (\d+) units( · )?$/, '$1 produkto · $2 piraso$3', '$1 ka produkto · $2 ka buok$3'],
  [/^(\d+) low$/, '$1 paubos', '$1 hapit mahurot'],
  [/^Customers get a text after (\d+) days of unpaid balance\. Change this anytime in Profile settings\.$/,
    'Makakatanggap ng text ang mga customer pagkalipas ng $1 araw na hindi bayad. Mababago ito anumang oras sa Profile settings.',
    'Makadawat og text ang mga customer human sa $1 ka adlaw nga wala mabayri. Mausab kini bisan kanus-a sa Profile settings.'],
  [/^(\d+)\/(\d+) products used$/, '$1/$2 produkto ang nagamit', '$1/$2 ka produkto ang nagamit'],
  [/^(.+) owes (₱\S+)$/, 'May utang si $1 na $2', 'Adunay utang si $1 nga $2'],
  [/^To (.+)$/, 'Para kay $1', 'Para kang $1'],
  [/^(.+) is now out of stock\.$/, 'Ubos na ang $1.', 'Hurot na ang $1.'],
  [/^(.+) is running low \((\d+) left\)\.$/, 'Paubos na ang $1 ($2 na lang).', 'Hapit na mahurot ang $1 ($2 na lang).'],
  [/^\+(\d+) (.+) \(now (\d+)\)\.$/, '+$1 $2 ($3 na ngayon).', '+$1 $2 ($3 na karon).'],
  [/^(.+) paid (₱\S+)\. Remaining (₱\S+)\.$/, 'Nagbayad si $1 ng $2. Natitira: $3.', 'Nibayad si $1 og $2. Nahabilin: $3.'],
  [/^(.+) paid (₱\S+)\. Balance cleared!$/, 'Nagbayad si $1 ng $2. Bayad na lahat!', 'Nibayad si $1 og $2. Bayad na tanan!'],
  [/^Reminder sent to (.+) \(\+63 (.+)\)\.$/, 'Naipadala ang paalala kay $1 (+63 $2).', 'Napadala ang pahinumdom kang $1 (+63 $2).'],
  [/^Verification code sent to \+63 (.+)\.$/, 'Naipadala ang verification code sa +63 $1.', 'Napadala ang verification code sa +63 $1.'],
  [/^(₱\S+) added to (.+) \(\+63 (.+)\)\.$/, 'Naidagdag ang $1 kay $2 (+63 $3).', 'Nadugang ang $1 kang $2 (+63 $3).'],
  [/^(.+) added with (\d+) in stock\.$/, 'Naidagdag ang $1 na may $2 na stock.', 'Nadugang ang $1 nga adunay $2 ka stock.'],
  [/^(.+) updated\.$/, 'Na-update ang $1.', 'Na-update ang $1.'],
  [/^(.+) created\.$/, 'Nagawa ang $1.', 'Nahimo ang $1.'],
  [/^(.+) removed\.$/, 'Naalis ang $1.', 'Natangtang ang $1.'],
  [/^Language set to (.+)\.$/, 'Itinakda ang wika sa $1.', 'Gi-set ang pinulongan sa $1.'],
  [/^This number is already saved for (.+)\.$/, 'Naka-save na ang number na ito para kay $1.', 'Naka-save na kini nga number para kang $1.'],
  [/^(.+) is already in your ledger\.$/, 'Nasa listahan mo na si $1.', 'Anaa na si $1 sa imong listahan.'],
  [/^That's more than the balance of (₱\S+)\.$/, 'Mas malaki iyan sa balanseng $1.', 'Mas dako kana sa balanse nga $1.'],
  [/^The (.+) plan allows (\d+) products\. Upgrade to Premium for expanded storage\.$/,
    'Hanggang $2 produkto lang sa $1 na plano. Mag-upgrade sa Premium para sa mas malaking storage.',
    'Hangtod $2 ka produkto lang sa $1 nga plano. Mag-upgrade sa Premium para sa mas dako nga storage.'],
  [/^Record sale of (.+)$/, 'Itala ang benta ng $1', 'Itala ang baligya sa $1'],
  [/^Edit (.+)$/, 'I-edit ang $1', 'Usba ang $1'],
  [/^No products match “(.+)”\.$/, 'Walang produktong tugma sa “$1”.', 'Walay produkto nga mohaum sa “$1”.'],
  [/^No categories match “(.+)”\.$/, 'Walang kategoryang tugma sa “$1”.', 'Walay kategorya nga mohaum sa “$1”.'],
  [/^(Standard|Premium) [Pp]lan$/, '$1 na Plano', '$1 nga Plano'],
  [/^Week of (.+)$/, 'Linggo ng $1', 'Semana sa $1'],
  [/^Today, (.+)$/, 'Ngayon, $1', 'Karon, $1'],
  [/^(.+) \((\d+) left\)$/, '$1 ($2 na lang)', '$1 ($2 na lang)'],
];

const MONTH_RE = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/g;
const MONTHS_TR = {
  fil: { Jan: 'Ene', Feb: 'Peb', Mar: 'Mar', Apr: 'Abr', May: 'May', Jun: 'Hun', Jul: 'Hul', Aug: 'Ago', Sep: 'Set', Oct: 'Okt', Nov: 'Nob', Dec: 'Dis' },
  ceb: { Jan: 'Ene', Feb: 'Peb', Mar: 'Mar', Apr: 'Abr', May: 'May', Jun: 'Hun', Jul: 'Hul', Aug: 'Ago', Sep: 'Sep', Oct: 'Okt', Nov: 'Nob', Dec: 'Dis' },
};

const langCode = () => LANGS[state?.settings?.language] || 'en';

/* Translate one English string into the current language. */
function t(text) {
  const code = langCode();
  if (code === 'en' || !text) return text;
  const col = code === 'fil' ? 0 : 1;
  const m = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  const [, lead, core, trail] = m;
  if (!core) return text;
  let out = DICT[core]?.[col];
  if (out === undefined) {
    for (const p of PATTERNS) {
      if (p[0].test(core)) { out = core.replace(p[0], p[1 + col]); break; }
    }
  }
  if (out === undefined) out = core;
  // Dates: "Nov 6, 2026", "Oct 24 — Nov 6", month labels on the chart
  if (/\d/.test(out) || /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/.test(out)) {
    out = out.replace(MONTH_RE, (mo) => MONTHS_TR[code][mo]);
  }
  return lead + out + trail;
}

/* ---------- Apply to the page (and keep applying as things change) ---------- */
const ATTRS = ['placeholder', 'title', 'aria-label'];
const SKIP = new Set(['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT']);

function translateText(node) {
  if (!node.parentNode || SKIP.has(node.parentNode.nodeName)) return;
  if (node._en === undefined || node.data !== node._tr) node._en = node.data;  // app wrote new text
  const out = t(node._en);
  node._tr = out;
  if (node.data !== out) node.data = out;
}
function translateAttrs(el) {
  for (const a of ATTRS) {
    if (!el.hasAttribute || !el.hasAttribute(a)) continue;
    el._i18n = el._i18n || {};
    const cur = el.getAttribute(a);
    const rec = el._i18n[a];
    const src = rec && cur === rec.tr ? rec.en : cur;
    const out = t(src);
    el._i18n[a] = { en: src, tr: out };
    if (cur !== out) el.setAttribute(a, out);
  }
}
function translateTree(root) {
  if (root.nodeType === 3) return translateText(root);
  if (root.nodeType !== 1 || SKIP.has(root.nodeName) && root.nodeName !== 'INPUT') return;
  translateAttrs(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n;
  while ((n = walker.nextNode())) {
    if (n.nodeType === 3) translateText(n);
    else translateAttrs(n);
  }
}

let i18nObserver;
function initI18n() {
  i18nObserver = new MutationObserver((muts) => {
    if (langCode() === 'en' && !document.documentElement.dataset.wasTranslated) return;
    for (const m of muts) {
      if (m.type === 'childList') m.addedNodes.forEach(translateTree);
      else if (m.type === 'characterData') { if (m.target.data !== m.target._tr) translateText(m.target); }
      else if (m.type === 'attributes') translateAttrs(m.target);
    }
  });
  i18nObserver.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  applyLanguage();
}

/* Re-translate everything on screen (called when the language changes). */
function applyLanguage() {
  const code = langCode();
  document.documentElement.lang = code;
  if (code !== 'en') document.documentElement.dataset.wasTranslated = '1';
  translateTree(document.body);
  document.title = document.title.split(' — ').map((part) => t(part)).join(' — ');
}

/* SMS reminder text in the chosen language */
function reminderText(c) {
  const store = state.profile.storeName, amt = peso(c.balance), items = c.items;
  switch (langCode()) {
    case 'fil': return `Hi ${c.name}! Paalala lang po mula sa ${store}: may balanse po kayong ${amt} (${items}). Salamat po!`;
    case 'ceb': return `Hi ${c.name}! Pahinumdom lang gikan sa ${store}: naa moy balanse nga ${amt} (${items}). Salamat!`;
    default: return `Hi ${c.name}! A friendly reminder from ${store}: you have a balance of ${amt} (${items}). Thank you!`;
  }
}
