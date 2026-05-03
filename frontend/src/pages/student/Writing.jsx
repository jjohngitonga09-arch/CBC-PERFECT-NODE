import { useState } from 'react'

const bg = 'var(--bg)'

const ENGLISH = {
 Personal: {
 desc: 'About yourself and your life',
 types: [
 {
 id: 'journal', label: 'Journal', desc: 'Daily thoughts and feelings',
 structure: ['Date', 'Mood / Weather', 'What happened today', 'What I felt', 'What I learned or wish for'],
 sample: `Monday, 5th May 2025\nMood: Hopeful. Weather: Sunny with a light breeze.\n\nToday was one of those days that started slowly but ended beautifully. I woke up late and nearly missed morning assembly, which put me in a panic. I ran the whole way to school and arrived just as the last notes of the national anthem faded. My heart was pounding.\n\nIn the afternoon we had a science experiment -- growing crystals using salt and hot water. Mine turned out the best in the class. Mr. Kariuki held it up to the window and the light caught it perfectly. Everyone clapped. I felt a warmth spread through my chest that I cannot quite describe.\n\nOn the way home, I stopped by the mango tree at the corner of our road. The mangoes are nearly ripe. I sat underneath it for a while and just thought about things -- about school, about my family, about the future.\n\nI felt grateful today. Not for anything big, just for the small things. The crystal. The sunshine. The mango tree. I want to remember this feeling.\n\nTomorrow I hope to finish my English essay and read two chapters of my library book.`
 },
 {
 id: 'diary', label: 'Diary Entry', desc: 'Private daily record',
 structure: ['Dear Diary,', 'Date', 'What happened', 'How I felt', 'What I hope for tomorrow'],
 sample: `Dear Diary,\n\nWednesday, 7th May 2025\n\nSomething happened today that I have been turning over in my mind ever since. My best friend Amina and I had an argument during lunch break. It started over something small -- whose turn it was to carry the class register -- but it grew into something bigger and by the time the bell rang we were not speaking.\n\nI sat through double Mathematics feeling a heavy stone in my stomach. Numbers swam on the page. Mrs. Njeri asked me a question and I answered the wrong one entirely. The class laughed, but not meanly.\n\nAfter school I waited by the gate, hoping Amina would come past. She did. We looked at each other for a moment and both started apologising at exactly the same time. We laughed so hard we had to hold the fence to stay standing.\n\nI felt relief pour through me like cold water on a hot afternoon. Friendship is such a fragile and beautiful thing. I do not want to take it for granted again.\n\nTomorrow I hope we share our packed lunches as we always do and that everything feels normal again. I think it will.`
 },
 {
 id: 'cv', label: 'CV / Resume', desc: 'Your skills and experience',
 structure: ['Full Name & Contacts', 'Personal Profile', 'Education', 'Skills', 'Hobbies & Interests', 'References'],
 sample: `AMARA WANJIKU ODHIAMBO\nNairobi, Kenya | amara.odhiambo@email.com | 0712 345 678\n\nPERSONAL PROFILE\nI am a hardworking and enthusiastic Form Four student with a passion for science and community service. I am punctual, reliable, and work well both independently and as part of a team. I am seeking an attachment opportunity where I can apply my academic knowledge and develop practical skills.\n\nEDUCATION\nNairobi Girls High School, Nairobi | 2021 - Present\nKenya Certificate of Secondary Education (KCSE) -- Expected Grade: A\nKey subjects: Mathematics, Biology, Chemistry, English, Kiswahili\n\nSunshine Primary School, Nairobi | 2013 - 2020\nKenya Certificate of Primary Education (KCPE) -- Score: 398/500\n\nSKILLS\n- Strong written and spoken communication in English and Kiswahili\n- Basic computer skills: Microsoft Word, Excel, PowerPoint\n- First Aid certified (Kenya Red Cross, 2024)\n- Leadership and event organisation\n\nHOBBIES & INTERESTS\nReading, public speaking, environmental conservation, and football.\n\nREFERENCES\nAvailable upon request.`
 },
 {
 id: 'biography', label: 'Biography', desc: "Someone else's life story",
 structure: ['Introduction', 'Early Life', 'Education & Career', 'Major Achievements', 'Challenges Faced', 'Legacy'],
 sample: `Wangari Maathai: The Woman Who Planted Hope\n\nWangari Muta Maathai was one of the most remarkable women Africa has ever produced. A scientist, activist, and Nobel Peace Prize laureate, she dedicated her life to the belief that caring for the earth and fighting for justice are the same struggle.\n\nBorn on 1st April 1940 in Nyeri, Kenya, Wangari grew up in the fertile highlands near Mount Kenya. As a child she played by clear streams and under trees that seemed ancient and permanent. She later said that watching those streams dry up as forests disappeared broke something open inside her.\n\nShe excelled academically and became the first woman in East and Central Africa to earn a doctorate degree, from the University of Nairobi in 1971. She later became a professor and department chair -- another first for a woman in the region.\n\nIn 1977 she founded the Green Belt Movement, a grassroots organisation that mobilised women across Kenya to plant trees. Over decades, more than fifty million trees were planted, restoring watersheds and providing women with income and dignity.\n\nShe faced imprisonment, beatings, and public ridicule from the government of Daniel arap Moi. She refused to be silenced.\n\nIn 2004 she became the first African woman to win the Nobel Peace Prize. She died in 2011, but her trees still stand.`
 },
 {
 id: 'auto', label: 'Autobiography', desc: 'Your own life story',
 structure: ['Introduction', 'Early Childhood', 'Growing Up', 'Important Events', 'Goals & Dreams', 'Conclusion'],
 sample: `My Story: A Life Still Being Written\n\nMy name is Kofi James Mutua, and I was born on a rainy Tuesday morning in Kisumu, the third child of four. My mother tells me I came into the world quietly, as though I was listening first before deciding to announce myself. Perhaps that is still who I am.\n\nMy earliest memory is of my grandmother's kitchen -- the smell of ugali bubbling in a heavy pot, the orange glow of the jiko, her voice low and steady telling stories I could not fully understand but felt in my chest.\n\nI grew up in a modest household where books were treated like guests of honour. My father, a secondary school teacher, believed that education was the one gift no one could ever take from you. He installed that belief in me like a foundation stone.\n\nWhen I was twelve, my father fell ill and could not work for nearly a year. I watched my mother carry the family on her back without complaint. That year taught me more about strength and love than any classroom ever has.\n\nToday I am in Form Three, studying hard, dreaming bigger. I want to become an engineer and build clean water systems in rural communities.\n\nMy story is still being written. I intend to make it worth reading.`
 },
 {
 id: 'statement', label: 'Personal Statement', desc: 'For applications / admissions',
 structure: ['Opening hook', 'Why this programme?', 'Strengths & achievements', 'What you will contribute', 'Closing statement'],
 sample: `From the moment I first looked through a microscope and saw a world invisible to the naked eye, I knew that science was not just a subject I studied -- it was a language I spoke naturally.\n\nI am applying to study Medicine at the University of Nairobi because I believe that good health is the foundation on which every other human ambition rests. Growing up in a community where the nearest hospital was forty kilometres away, I witnessed how the absence of accessible healthcare shapes lives -- limiting possibilities, cutting stories short.\n\nThroughout my time at Lenana School, I have maintained a strong academic record, consistently ranking in the top five percent of my class in Biology, Chemistry, and Mathematics. Beyond academics, I have served as health prefect for two years, coordinating wellness campaigns and first aid training for over three hundred students.\n\nI am also a strong communicator and a patient listener -- qualities I believe are as essential to medicine as technical knowledge. I have volunteered at Kenyatta National Hospital's outpatient department every school holiday for the past two years.\n\nI am ready to work hard, to learn humbly, and to serve well. Medicine is not my plan B. It is the only plan I have ever had.`
 },
 {
 id: 'narrative', label: 'Personal Narrative', desc: 'A true story from your life',
 structure: ['Setting the scene', 'The event', 'Your feelings & thoughts', 'The turning point', 'What you learned'],
 sample: `The Day I Nearly Gave Up\n\nIt was a Thursday morning in March, the kind that arrives grey and indifferent. I sat at my desk before the mathematics examination, staring at my revision notes without seeing them. My hands were cold. My mind was a blank white room.\n\nFor three months I had been failing mathematics. Not by a little -- by a great, humiliating margin. Each marked paper returned to me felt like a door being shut in my face. My classmates seemed to understand things that I could not grasp no matter how many times I read them. I had begun to believe, quietly and with certainty, that I was simply not capable.\n\nThat morning, something shifted. My teacher, Mr. Otieno, stopped beside my desk before the papers were handed out. He said nothing dramatic. He just said, "You have been working harder than you know, Akinyi." Then he moved on.\n\nThose eight words cracked something open.\n\nI sat the examination differently that day -- not confidently, but present. I did not leave any question blank. I finished with ten minutes to spare.\n\nI passed. Not perfectly. But I passed.\n\nI learned that the story we tell ourselves about our own abilities is the most powerful story of all -- and we are allowed to rewrite it.`
 },
 ]
 },
 Letters: {
 desc: 'All types of letters in English',
 types: [
 {
 id: 'formal', label: 'Formal Letter', desc: 'To officials, companies, schools',
 structure: ['Your address', 'Date', 'Recipient address', 'Salutation', 'Introduction', 'Body', 'Closing', 'Yours faithfully'],
 sample: `14 Acacia Road\nWestlands\nNairobi\n14th May 2025\n\nThe Principal\nGreenfields Secondary School\nP.O. Box 4521\nNairobi\n\nDear Sir/Madam,\n\nRE: Application for School Transfer\n\nI am writing to formally request a transfer for my daughter, Melissa Achieng, currently enrolled in Form Two at Riverside Girls High School. Due to a change in our family's place of residence, it is no longer practical for Melissa to continue attending her current school.\n\nMelissa is a dedicated student with a strong academic record, consistently achieving marks above seventy percent across all core subjects. She is also an active member of the school's debate team and environmental club. I am confident that she will make a positive contribution to Greenfields Secondary School.\n\nI have enclosed her most recent academic transcripts, a recommendation letter from her current class teacher, and copies of the relevant identification documents. I am available for a meeting at your earliest convenience to discuss the transfer process in detail.\n\nI trust that you will consider this application favourably and look forward to your response.\n\nYours faithfully,\n\nMargaret Achieng\nParent / Guardian`
 },
 {
 id: 'informal', label: 'Informal / Friendly', desc: 'To friends and family',
 structure: ['Your address', 'Date', 'Dear [Name],', 'Opening', 'News / story', 'Questions', 'Closing', 'Your friend'],
 sample: `Flat 3, Mombasa Road\nNairobi\n10th May 2025\n\nDear Josephine,\n\nI hope this letter finds you well and that life in Mombasa is treating you kindly. It feels like forever since we last saw each other -- I still think about that afternoon we spent at the beach eating grilled maize and laughing until our stomachs hurt!\n\nThings here have been busy but good. School has been intense, especially with mock examinations coming up in two weeks. I have been spending most evenings at the library, which sounds very serious but honestly I spend half the time drawing in the margins of my notebook and the other half actually studying.\n\nLast weekend my family visited the Nairobi National Park for the first time in years. We saw three lions resting under an acacia tree, completely unbothered by the world. I envied them a little.\n\nHow is your school going? Have you joined any new clubs this term? I remember you were thinking about joining the swimming team -- did that happen? Please write and tell me everything.\n\nI miss you terribly and I am already looking forward to the December holidays when we can hopefully meet again.\n\nWrite soon!\n\nYour friend,\nNjeri`
 },
 {
 id: 'application', label: 'Application Letter', desc: 'Applying for a job or school',
 structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'Position applied for', 'Qualifications', 'Why you are best', 'Request interview', 'Yours faithfully'],
 sample: `22 Ngong Road\nKaren\nNairobi\n12th May 2025\n\nThe Human Resources Manager\nSafaricom PLC\nP.O. Box 66827\nNairobi\n\nDear Sir/Madam,\n\nRE: Application for Customer Experience Internship\n\nI am writing to apply for the Customer Experience Internship position advertised on your company website on 5th May 2025. I am a final-year Bachelor of Commerce student at the University of Nairobi, majoring in Marketing, and I believe I have both the academic grounding and the personal qualities to contribute meaningfully to your team.\n\nThroughout my studies I have maintained a consistent grade point average of 3.7 out of 4.0 and completed coursework in consumer behaviour, digital marketing, and service management. During my second year, I completed a successful two-month placement at a local telecommunications firm where I assisted in managing customer queries and contributed to a fifteen percent improvement in resolution time.\n\nI am a strong communicator, fluent in English and Kiswahili, and am comfortable with CRM systems and Microsoft Office. I am enthusiastic, eager to learn, and committed to delivering excellent service.\n\nI would welcome the opportunity to discuss my application further. I am available for an interview at any time convenient to you.\n\nYours faithfully,\n\nBrian Kamau\nTel: 0723 456 789`
 },
 {
 id: 'complaint', label: 'Complaint Letter', desc: 'Reporting a problem formally',
 structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'State the problem', 'Give details & dates', 'Impact on you', 'Expected action', 'Yours faithfully'],
 sample: `8 Riverside Drive\nLavington\nNairobi\n9th May 2025\n\nThe Customer Service Manager\nNairobi Water and Sewerage Company\nP.O. Box 30655\nNairobi\n\nDear Sir/Madam,\n\nRE: Persistent Water Supply Interruption -- Account Number NW/2034/LV\n\nI am writing to formally complain about the severe and persistent interruption to water supply at my residential address above. For the past three weeks, since approximately 18th April 2025, our estate has experienced water supply for fewer than four hours per day, often between midnight and 4 a.m., making it impossible to access water during normal waking hours.\n\nI have reported this issue twice by telephone -- on 22nd April and again on 2nd May -- and was each time assured that the matter would be resolved within 48 hours. To date, no meaningful improvement has occurred. Our household of six people, including two young children and an elderly parent, has been significantly inconvenienced and forced to purchase water at considerable expense.\n\nI kindly request that this matter be investigated urgently and that a technician be dispatched within three working days. I also request a written explanation of the cause of the disruption.\n\nI look forward to your prompt response.\n\nYours faithfully,\n\nPeter Ndirangu\nTel: 0700 123 456`
 },
 {
 id: 'thankyou', label: 'Thank You Letter', desc: 'Expressing gratitude formally',
 structure: ['Your address & date', 'Recipient address', 'Dear [Name],', 'Express thanks', 'Specific reason', 'Impact', 'Future hopes', 'Yours sincerely'],
 sample: `16 Kileleshwa Close\nNairobi\n8th May 2025\n\nMr. James Waweru\nHead of Department, Sciences\nAlliance High School\nP.O. Box 1001, Kikuyu\n\nDear Mr. Waweru,\n\nI am writing to express my sincere and heartfelt gratitude for the exceptional support and encouragement you provided me throughout my final year at Alliance High School.\n\nWhen I joined Form Four, I was deeply uncertain about my ability to perform well in Physics and Chemistry. Your patience, clear explanations, and genuine belief in my potential made an enormous difference. You gave up lunch breaks to offer extra lessons, marked my practice papers with detailed feedback, and never once made me feel that my questions were too basic.\n\nWhen my KCSE results were released and I achieved an A in both sciences, the first person I thought of was you. That result does not belong to me alone -- it belongs to you as well.\n\nI am now preparing to study Engineering at the University of Nairobi, and I carry your lessons with me -- not just about Physics, but about perseverance and the dignity of hard work.\n\nI hope you know what a lasting difference a dedicated teacher makes.\n\nYours sincerely,\n\nDaniel Otieno`
 },
 {
 id: 'enquiry', label: 'Enquiry Letter', desc: 'Asking for information',
 structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'What you need', 'Specific questions', 'How to respond', 'Thank them', 'Yours faithfully'],
 sample: `5 Thika Road\nRoysambu\nNairobi\n11th May 2025\n\nThe Admissions Officer\nKenya Medical Training College\nP.O. Box 30195\nNairobi\n\nDear Sir/Madam,\n\nRE: Enquiry Regarding Nursing Programme Admissions for 2026\n\nI am writing to request information regarding the requirements and application process for the Certificate in Nursing programme at your institution for the academic year beginning January 2026.\n\nI am currently completing my Kenya Certificate of Secondary Education examinations and am keen to pursue a career in healthcare. I would be grateful if you could provide me with the following information:\n\n1. The minimum KCSE grade required for admission to the Nursing programme.\n2. The specific subject requirements, particularly whether Biology and Chemistry are mandatory.\n3. The application deadline and process for the January 2026 intake.\n4. Whether bursaries or financial assistance are available for qualifying students.\n\nI would appreciate it if you could respond by email at the address below or by post to the address above. I am also happy to visit the institution in person if that would be more convenient.\n\nThank you in advance for your assistance.\n\nYours faithfully,\n\nGrace Muthoni\nEmail: grace.muthoni@email.com`
 },
 {
 id: 'request', label: 'Request Letter', desc: 'Asking for something politely',
 structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'What you are requesting', 'Reasons', 'Supporting info', 'Thank them', 'Yours faithfully'],
 sample: `23 Jogoo Road\nEastleigh\nNairobi\n13th May 2025\n\nThe Librarian\nNairobi City Library\nP.O. Box 14091\nNairobi\n\nDear Sir/Madam,\n\nRE: Request for Extended Borrowing Period\n\nI am writing to kindly request an extension of the borrowing period for three books I currently hold on my library card (Card No. NCL/4872). The books are: Organic Chemistry by Morrison and Boyd, A Guide to Cell Biology by Alberts, and Introduction to Genetics by Lewin.\n\nI borrowed these books on 20th April 2025 for a period of three weeks in preparation for my KCSE mock examinations. Due to an unexpected illness that kept me away from my studies for ten days, I have been unable to make adequate use of these resources within the original borrowing period.\n\nI would be very grateful if the borrowing period could be extended by two additional weeks, until 10th June 2025. I assure you that I will return the books promptly and in good condition.\n\nI understand that other patrons may be waiting for these materials and I appreciate your understanding of my circumstances.\n\nYours faithfully,\n\nSamuel Kipchoge\nTel: 0711 234 567`
 },
 {
 id: 'cover', label: 'Cover Letter', desc: 'Sent with a CV or application',
 structure: ['Your address & date', 'Recipient address', 'Dear Hiring Manager,', 'Introduce yourself & role', 'Top skills', 'Why this company', 'Call to action', 'Yours sincerely'],
 sample: `17 Ngong Avenue\nKilimani\nNairobi\n15th May 2025\n\nThe Recruitment Manager\nNation Media Group\nP.O. Box 49010\nNairobi\n\nDear Hiring Manager,\n\nRE: Application for Junior Graphic Designer Position (Ref: NMG/GD/2025)\n\nI am writing to apply for the Junior Graphic Designer position advertised on your website on 8th May 2025. I am a recent graduate of the Kenya Polytechnic University College with a Diploma in Graphic Design and Communication, and I am excited about the opportunity to contribute my skills to one of East Africa's most respected media organisations.\n\nDuring my studies and subsequent freelance work, I developed strong competency in Adobe Illustrator, Photoshop, and InDesign, and built a portfolio spanning editorial layouts, brand identity projects, and digital campaign materials. One of my designs was selected for use in a national health awareness campaign run by the Ministry of Health in 2024.\n\nNation Media Group's commitment to quality visual storytelling and your recent expansion into digital platforms align perfectly with my ambitions and skills. I am eager to grow within an environment that values creativity and impact.\n\nI have attached my CV and a link to my portfolio. I would welcome the opportunity to discuss how I can contribute to your design team.\n\nYours sincerely,\n\nFatuma Hassan\nTel: 0733 567 890`
 },
 ]
 }
}

const KISWAHILI = {
 Binafsi: {
 desc: 'Kuhusu wewe mwenyewe',
 types: [
 {
 id: 'diary_sw', label: 'Diary / Shajara', desc: 'Mawazo ya kila siku',
 structure: ['Tarehe', 'Mpendwa Shajara,', 'Mambo yaliyotokea', 'Hisia zangu', 'Matarajio yangu'],
 sample: `Jumanne, 6 Mei 2025\n\nMpendwa Shajara,\n\nLeo ilikuwa siku ya ajabu -- mchanganyiko wa furaha na huzuni ambao haukutarajiwa. Asubuhi niliamka mapema kwa sababu nilikuwa na mtihani wa Kiswahili. Nilikuwa nimesoma hadi usiku wa manane na macho yangu yalikuwa mazito kama mawe.\n\nMtihani ulienda vizuri kuliko nilivyotarajia. Swali la insha lilikuwa kuhusu umuhimu wa lugha ya mama, na maneno yalikuja kwangu kwa urahisi, kana kwamba yalikuwa yakiningojea ndani ya moyo wangu. Mwalimu Awino alisimama nyuma yangu kwa muda na kisha akaendelea -- ishara ndogo ambayo iliniamsha.\n\nWakati wa mapumziko ya mchana, niliambiwa kwamba shangazi yangu mpendwa, Mama Zawadi, alikuwa hospitalini. Moyo wangu uliingia chini. Yeye ndiye aliyenifundisha kupika, kuimba, kusimulia hadithi. Ni nguzo yangu.\n\nNilikwenda kumwona baada ya shule. Alikuwa amekaa kitandani, dhaifu lakini akitabasamu. Alisema, "Umekuja." Kana kwamba kuja kwangu kulimburudisha zaidi ya dawa yoyote.\n\nUsiku huu nina shukrani moyoni -- kwa mtihani, kwa shangazi aliye hai, kwa uwezo wa kuandika hisia zangu mahali ambapo zinaweza kupumzika salama.\n\nKesho natumaini habari nzuri kutoka hospitalini na kwamba Mama Zawadi atarudi nyumbani hivi karibuni.`
 },
 {
 id: 'wasifu', label: 'Wasifu wa Kibinafsi', desc: 'Historia ya maisha yako',
 structure: ['Utangulizi', 'Utoto wangu', 'Ukuaji wangu', 'Matukio muhimu', 'Malengo na ndoto zangu', 'Hitimisho'],
 sample: `Mimi Ni Nani: Hadithi ya Maisha Yangu\n\nJina langu ni Amina Halima Osei, na nilizaliwa tarehe 3 Machi 2008 katika mji wa Mombasa, mtoto wa kwanza kati ya watoto watatu. Mama yangu ni muuguzi na baba yangu ni mwalimu wa hesabu -- watu wawili walionipatia fursa ya kupenda maarifa tangu utotoni.\n\nUtoto wangu ulikuwa na furaha na changamoto kwa pamoja. Tuliishi karibu na bahari, na kumbukumbu zangu za mapema zimejaa harufu ya chumvi, kelele za mawimbi, na michezo ya jioni kwenye mchanga. Bibi yangu alikuwa msimulizi bora -- masimulizi yake ya usiku yalibeba hekima na ucheshi kwa pamoja.\n\nNilianza shule ya msingi akiwa na miaka sita. Nilijikuta nikipenda masomo ya Kiswahili na Sayansi zaidi ya yote. Darasa la tano niliandika hadithi fupi ambayo mwalimu wangu aliisoma mbele ya shule yote -- siku ile niliamua kwamba siku moja nitakuwa mwandishi.\n\nKipindi kigumu kilikuja mwaka 2020 wakati baba yangu alipopoteza kazi kwa muda kwa sababu ya janga la COVID-19. Nilijifunza mengi kuhusu uvumilivu na umoja wa familia katika kipindi hicho.\n\nLeo nasomea Kidato cha Tatu, nikiwa na ndoto ya kusomea Uandishi wa Habari chuo kikuu. Nataka kutumia kalamu yangu kusimamia ukweli na kuwasiliana na watu wa makabila yote.\n\nHadithi yangu bado inaandikwa -- na ninatazamia kila ukurasa ujao kwa moyo wazi.`
 },
 {
 id: 'cv_sw', label: 'CV / Wasifu wa Kazi', desc: 'Ujuzi na uzoefu wako',
 structure: ['Jina Kamili na Mawasiliano', 'Wasifu Mfupi', 'Elimu', 'Ujuzi', 'Shughuli & Maslahi', 'Marejeo'],
 sample: `OMAR ABDALLAH HASSAN\nMombasa, Kenya | omar.hassan@barua.com | 0721 678 901\n\nWASIFU MFUPI\nMimi ni mwanafunzi wa Kidato cha Nne mwenye bidii na nia ya kupata uzoefu wa kazi. Nina uwezo mzuri wa mawasiliano, kazi ya timu, na kutatua matatizo. Ninatafuta fursa ya kujifunza na kuchangia katika mazingira ya kazi ya kweli.\n\nELIMU\nShule ya Sekondari ya Mama Ngina, Mombasa | 2021 - Sasa\nCheti cha Elimu ya Sekondari (KCSE) -- Inatarajiwa: B+\nMasomo Makuu: Kiswahili, Biologia, Hesabu, Fizikia, Kiingereza\n\nShule ya Msingi ya Mvita, Mombasa | 2013 - 2020\nCheti cha Msingi (KCPE) -- Alama: 387/500\n\nUJUZI\n- Mawasiliano mazuri kwa Kiswahili na Kiingereza (mdomo na maandishi)\n- Ujuzi wa kompyuta: Microsoft Word, Excel, Mtandao\n- Uongozi: Mkuu wa Madarasa Darasa la Tisa na Kumi\n- Msaidizi wa kliniki ya shule (mwaka 2024)\n\nSHUGHULI NA MASLAHI\nUshairi, mpira wa miguu, utunzaji wa mazingira, kusoma vitabu.\n\nMAREJEO\nYanapatikana kuombwa.`
 },
 {
 id: 'bio_sw', label: 'Biografia', desc: 'Historia ya mtu mwingine',
 structure: ['Utangulizi', 'Utoto na Familia', 'Elimu na Kazi', 'Mafanikio Makuu', 'Changamoto', 'Urithi wake'],
 sample: `Wangari Maathai: Mwanamke Aliyepanda Miti ya Tumaini\n\nWangari Muta Maathai alikuwa miongoni mwa wanawake mashuhuri zaidi Afrika aliwahi kuzaa. Mwanasayansi, mwanaharakati, na mshindi wa Tuzo ya Amani ya Nobel, alitumia maisha yake kuamini kwamba kutunza ardhi na kupigana kwa haki ni mapambano moja.\n\nAlizaliwa tarehe 1 Aprili 1940 huko Nyeri, Kenya, katika nyanda za kijani karibu na Mlima Kenya. Utoto wake ulijaa mito ya maji safi na misitu inayoonekana kuwa ya milele. Baadaye alisema kwamba kuona mito hiyo ikikauka misitu ilipovunjwa ilivunja kitu ndani yake.\n\nAlifanya vizuri sana masomoni na akawa mwanamke wa kwanza Afrika ya Mashariki na Kati kupata shahada ya uzamili, kutoka Chuo Kikuu cha Nairobi mwaka 1971. Baadaye akawa profesa -- ushindi mwingine wa kwanza kwa mwanamke katika eneo hilo.\n\nMwaka 1977 alianzisha Harakati ya Mkanda wa Kijani, shirika la wananchi ambalo lilihamasisha wanawake kupanda miti. Kwa miongo mingi, miti zaidi ya milioni hamsini ilipandwa, ikirudisha maji ardhini na kutoa wanawake mapato na heshima.\n\nAlikabiliwa na kifungo, mapigo, na dharau kutoka serikalini. Alikataa kukimbia.\n\nMwaka 2004 akawa mwanamke wa kwanza wa Afrika kushinda Tuzo ya Amani ya Nobel. Alifariki mwaka 2011, lakini miti yake bado inasimama.`
 },
 ]
 },
 Barua: {
 desc: 'Aina zote za barua kwa Kiswahili',
 types: [
 {
 id: 'rasmi', label: 'Barua Rasmi', desc: 'Kwa mamlaka na ofisi',
 structure: ['Anwani yako', 'Tarehe', 'Anwani ya mpokeaji', 'Mada', 'Utangulizi', 'Maudhui', 'Hatua unayohitaji', 'Wako mwaminifu'],
 sample: `Nyumba Na. 7, Barabara ya Uhuru\nNakuru\n14 Mei 2025\n\nMkuu wa Shule\nShule ya Sekondari ya Nakuru\nS.L.P 1234\nNakuru\n\nNdugu Mkuu wa Shule,\n\nMADA: OMBI LA UHAMISHO WA MWANAFUNZI\n\nNinaandika barua hii kwa heshima kubwa kuomba uhamisho wa mwanangu, Jabari Otieno, kutoka Shule ya Sekondari ya Moi hadi shule yako. Sababu ya ombi hili ni kwamba familia yetu imehamia Nakuru hivi karibuni baada ya baba yake kupata kazi ya kudumu katika mji huu.\n\nJabari yuko Kidato cha Pili na ana rekodi nzuri ya masomo. Katika mtihani wake wa mwisho alipata wastani wa asilimia sabini na mbili. Pia ni mwanachama wa timu ya mpira wa miguu na kilabu cha sayansi.\n\nNimeweka nyaraka zifuatazo pamoja na barua hii: nakala ya matokeo ya masomo, cheti cha mwenendo mzuri kutoka kwa mwalimu wake wa sasa, na nakala za vitambulisho vya familia.\n\nNinaomba unifahamishe kuhusu hatua zinazofuata ili mwanangu aweze kuanza masomo yake hivi karibuni iwezekanavyo.\n\nAsante kwa ushirikiano wako.\n\nWako mwaminifu,\n\nElizabeth Otieno\nNambari ya Simu: 0722 345 678`
 },
 {
 id: 'rafiki', label: 'Barua ya Rafiki', desc: 'Kwa marafiki na familia',
 structure: ['Anwani yako', 'Tarehe', 'Mpendwa [Jina],', 'Salamu', 'Habari / hadithi', 'Maswali', 'Kufunga', 'Rafiki yako'],
 sample: `Nyumba Na. 4, Mtaa wa Makadara\nNairobi\n10 Mei 2025\n\nMpendwa Zawadi,\n\nHabari yako, rafiki yangu wa zamani! Natumaini uko salama na afya njema. Kwangu hapa Nairobi mambo yanakwenda lakini nakukumbuka kila wakati -- hasa wakati naona pipi za sukari dukani kwa sababu unajua wewe ndiye aliyenifundisha kuzipenda!\n\nWiki hii ilikuwa na msongo wa masomo. Tulianza mada mpya ya Kemia ambayo inaitwa Kemikali za Kikaboni na kichwa changu kimechoka kabisa. Lakini mwalimu wetu mpya, Bwana Kimani, ana njia ya kufundisha ambayo inafanya mambo magumu kuonekana rahisi. Ninashukuru kwa hilo.\n\nSiku ya Jumamosi tulipiga picha za darasa kwa mara ya kwanza. Nilivaa kanzu yangu ya bluu -- ile unayoipenda -- na matokeo yalikuwa mazuri. Nitakutumia picha moja ukiniambia anwani yako mpya.\n\nNa wewe, habari za shule na familia? Je, bado unacheza mpira wa pete? Ulikuwa bingwa! Naomba uniambie kila kitu.\n\nNinatumaini tutaonana likizoni kwa sababu niko tayari kwa mazungumzo marefu na chakula cha bibi!\n\nRafiki yako wa moyoni,\nAmina`
 },
 {
 id: 'ombi', label: 'Barua ya Ombi', desc: 'Kuomba kitu kwa heshima',
 structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Taja unachoomba', 'Toa sababu', 'Maelezo ya ziada', 'Shukrani za mapema', 'Wako mwaminifu'],
 sample: `Nyumba Na. 12, Mtaa wa Shauri Moyo\nMombasa\n12 Mei 2025\n\nMkurugenzi wa Elimu\nKaunti ya Mombasa\nS.L.P 4000\nMombasa\n\nNdugu Mkurugenzi,\n\nMADA: OMBI LA BURSARY YA MASOMO\n\nNinaandika barua hii kwa unyenyekevu mkubwa kuomba msaada wa fedha za masomo (bursary) kwa mwaka wa masomo 2025/2026. Ninasoma Kidato cha Tatu katika Shule ya Sekondari ya Likoni na ninahitaji msaada wa kulipa ada ya shilingi kumi na mbili elfu kwa mwaka.\n\nFamilia yangu inakabiliwa na hali ngumu ya kiuchumi baada ya baba yangu kufariki mwaka jana. Mama yangu, ambaye ni mama wa nyumbani, sasa anabeba mzigo wa kutunza familia yetu ya watoto watano peke yake. Kipato chake kidogo kinatoka kwa kazi za kilimo za msimu ambazo hazitoshi kugharamia mahitaji yetu yote.\n\nLicha ya hali hii ngumu, nimeweza kudumisha matokeo mazuri ya masomo. Katika mtihani wangu wa mwisho nilipata wastani wa asilimia sabini na nane. Naamini kwamba kwa msaada mdogo, nitaweza kuendelea na masomo yangu na kufikia ndoto zangu za kuwa daktari.\n\nNimeweka hati zinazohitajika pamoja na barua hii, ikiwa ni pamoja na matokeo ya masomo na hati ya kifo cha baba yangu.\n\nAsante sana kwa msaada wako wa moyo wote.\n\nWako mwaminifu,\n\nHassan Mwangi Salim`
 },
 {
 id: 'maombi', label: 'Barua ya Maombi (Kazi)', desc: 'Kuomba kazi au nafasi',
 structure: ['Anwani yako & Tarehe', 'Anwani ya mwajiri', 'Ndugu Mwajiri,', 'Nafasi unayoomba', 'Elimu & uzoefu', 'Kwa nini wewe', 'Omba mahojiano', 'Wako mwaminifu'],
 sample: `Nyumba Na. 9, Barabara ya Kenyatta\nKisumu\n11 Mei 2025\n\nMeneja wa Rasilimali Watu\nKampuni ya Uchumi wa Jamii (KUSCCO)\nS.L.P 1765\nNairobi\n\nNdugu Meneja,\n\nMADA: MAOMBI YA NAFASI YA AFISA MTENDAJI WA UCHUMI\n\nNinaomba kwa heshima nafasi ya kazi ya Afisa Mtendaji wa Uchumi iliyotangazwa katika gazeti la Daily Nation la tarehe 5 Mei 2025. Nina shahada ya Kwanza ya Biashara kutoka Chuo Kikuu cha Maseno, nikihitimu mwaka 2024 kwa daraja la pili la juu.\n\nWakati wa masomo yangu, nilifanya utafiti wa mwisho kuhusu athari za akiba za kikundi kwa maendeleo ya kiuchumi ya wanawake vijijini -- utafiti ambao ulipata tuzo ya bora zaidi katika idara yangu. Pia nilifanya kazi kama mwanasiasa mdogo katika Shirika la KWFT kwa miezi minne, ambapo nilishiriki katika kutoa mafunzo ya ujasiriamali na kutembelea vikundi vya akiba.\n\nNinaamini kwamba bidii yangu, uwezo wangu wa mawasiliano kwa Kiswahili na Kiingereza, na uelewa wangu wa masuala ya uchumi wa wananchi vinafanya niwe mgombea mwema kwa nafasi hii.\n\nNinaomba kupewa fursa ya mahojiano ili niweze kueleza zaidi uwezo wangu.\n\nAsante kwa muda wako.\n\nWako mwaminifu,\n\nLydia Auma Otieno\nSimu: 0733 456 789`
 },
 {
 id: 'shukrani', label: 'Barua ya Shukrani', desc: 'Kushukuru rasmi au kwa moyo',
 structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Toa shukrani', 'Taja sababu maalum', 'Athari ya msaada', 'Matumaini ya siku zijazo', 'Wako mwaminifu'],
 sample: `Nyumba Na. 3, Mtaa wa Parklands\nNairobi\n8 Mei 2025\n\nMwalimu Jane Wangari\nMwalimu wa Kiswahili\nShule ya Sekondari ya Alliance Girls\nS.L.P 1001, Kikuyu\n\nMpendwa Mwalimu Wangari,\n\nNinaandika barua hii kwa moyo uliojaa shukrani za kweli kwa msaada na uvumilivu wako wakati wote wa mwaka wangu wa mwisho shuleni.\n\nNilipoingia Kidato cha Nne, nilikuwa na hofu kubwa kuhusu Kiswahili -- hasa sehemu ya insha na uchanganuzi wa mashairi. Wewe ulinisaidia kuelewa kwamba lugha si tu sarufi na maneno bali ni ufunuo wa utamaduni na hisia za binadamu. Umesimama muda wote bila kunichoka hata nilipouliza maswali mara nyingi.\n\nNilipoona matokeo yangu ya KCSE -- daraja la A katika Kiswahili -- machozi yalinijia. Sikuweza kuamini. Lakini wewe uliamini kabla sijaamini mimi mwenyewe.\n\nSasa ninajiandaa kusomea Uandishi wa Habari katika Chuo Kikuu cha Nairobi, na ninajua kwamba misingi ya lugha uliyonipa itanisaidia sana.\n\nNakushukuru kutoka moyoni. Wewe si mwalimu tu -- ni mwanga.\n\nWako kwa upendo na shukrani,\nPauline Nyambura`
 },
 {
 id: 'malalamiko', label: 'Barua ya Malalamiko', desc: 'Kuripoti tatizo rasmi',
 structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Taja tatizo', 'Maelezo & tarehe', 'Athari kwako', 'Hatua unayotarajia', 'Wako mwaminifu'],
 sample: `Nyumba Na. 18, Barabara ya Jogoo\nEastleigh, Nairobi\n13 Mei 2025\n\nMkurugenzi Mkuu\nKampuni ya Umeme Kenya (KPLC)\nS.L.P 30099\nNairobi\n\nNdugu Mkurugenzi,\n\nMADA: MALALAMIKO KUHUSU KUKATIKA KWA UMEME MARA KWA MARA -- NAMBARI YA AKAUNTI: KP/3421/EA\n\nNinaandika barua hii kuwasilisha malalamiko ya rasmi kuhusu tatizo la kukatika kwa umeme ambalo limekuwa likiendelea katika mtaa wetu tangu tarehe 20 Aprili 2025.\n\nKatika kipindi cha wiki tatu zilizopita, umeme umekuwa ukikatika kati ya mara tatu hadi tano kwa siku, kila kukatika kudumu kwa saa mbili hadi sita. Nimewasiliana na ofisi yenu kwa simu mara mbili -- tarehe 25 Aprili na tena tarehe 4 Mei -- na kila wakati niliahidiwa tatizo litatatuliwa ndani ya masaa ishirini na nne. Hadi leo hakuna mabadiliko.\n\nTatizo hili limeniathiri vibaya sana. Biashara yangu ndogo ya kutengeneza nguo inategemea umeme, na nimepoteza mapato ya zaidi ya shilingi thelathini elfu kutokana na kufanya kazi pungufu. Chakula changu cha jokofu pia kiliharibika mara moja.\n\nNinaomba tatizo hili lichunguzwe haraka na litarajiwe kutatuliwa ndani ya siku tatu za kazi. Pia ninaomba fidia kwa hasara niliyopata.\n\nNinatumaini majibu yenu ya haraka.\n\nWako mwaminifu,\n\nFatuma Abdalla\nSimu: 0700 234 567`
 },
 {
 id: 'pepe', label: 'Barua Pepe (Email)', desc: 'Ujumbe wa kielektroniki',
 structure: ['Kwa:', 'Mada:', 'Ndugu [Jina],', 'Kusudi', 'Maelezo', 'Hatua inayohitajika', 'Asante', 'Jina lako'],
 sample: `Kwa: admissions@university.ac.ke\nMada: Ombi la Taarifa za Udahili - Shahada ya Ualimu 2026\n\nNdugu Afisa wa Udahili,\n\nNinakusalimu kwa heshima na kutumainia uko salama. Ninaandika barua pepe hii kuomba taarifa za kina kuhusu mchakato wa udahili kwa programu ya Shahada ya Ualimu (B.Ed) kwa mwaka wa masomo unaoanza Januari 2026.\n\nKwa sasa ninafanya mitihani ya KCSE na ninatarajia kuhitimu hivi karibuni. Nimekuwa na ndoto ya kuwa mwalimu wa sayansi katika shule za sekondari, na ninaamini kwamba taasisi yenu ina programu bora ya kunitayarisha kwa kazi hiyo.\n\nNinaomba unifahamishe kuhusu yafuatayo:\n\n1. Masharti ya KCSE yanayohitajika kwa programu hii.\n2. Tarehe ya mwisho ya kuwasilisha maombi.\n3. Kama kuna nafasi za ufadhili au bursary kwa wanafunzi wanaostahili.\n4. Nyaraka zinazohitajika wakati wa kuwasilisha ombi.\n\nAsante sana kwa muda wako. Ninatumainia majibu yako hivi karibuni.\n\nKwa heshima,\nMohamed Sharif Abdi\nSimu: 0712 890 123\nBarua pepe: mohamed.abdi@gmail.com`
 },
 ]
 }
}

function Modal({ item, lang, onClose, onNext, onPrev, hasNext, hasPrev }) {
 const [tab, setTab] = useState('sample')
 const [copied, setCopied] = useState(false)
 const copy = () => {
 navigator.clipboard.writeText(item.sample)
 setCopied(true)
 setTimeout(() => setCopied(false), 2000)
 }
 return (
 <div onClick={onClose} style={{
 position: 'fixed', inset: 0, zIndex: 1000,
 background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)',
 display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
 }}>
 <div onClick={e => e.stopPropagation()} style={{
 background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '18px',
 width: '100%', maxWidth: '680px', maxHeight: '88vh',
 display: 'flex', flexDirection: 'column', overflow: 'hidden'
 }}>
 <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
 <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
 <div>
 <p style={{ fontWeight: 800, color: 'var(--text)', margin: '0 0 3px', fontSize: '1.1rem' }}>{item.label}</p>
 <p style={{ color: 'var(--sub)', fontSize: '.78rem', margin: 0 }}>{item.desc}</p>
 </div>
 <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
 <button onClick={copy} style={{
 padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--surface-hover)',
 background: copied ? 'rgba(34,197,94,0.15)' : '#0f1520',
 color: copied ? '#4ade80' : 'var(--sub)', fontWeight: 600, fontSize: '.75rem', cursor: 'pointer'
 }}>{copied ? ' Copied!' : 'Copy'}</button>
 <button onClick={onPrev} disabled={!hasPrev} style={{
 padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--surface-hover)',
 background: hasPrev ? '#0f1520' : 'transparent', color: hasPrev ? '#a5b4fc' : 'var(--surface-hover)',
 fontWeight: 700, fontSize: '.75rem', cursor: hasPrev ? 'pointer' : 'default'
 }}>&larr; Prev</button>
 <button onClick={onNext} disabled={!hasNext} style={{
 padding: '7px 14px', borderRadius: '8px', border: 'none',
 background: hasNext ? '#6366f1' : 'var(--surface)', color: hasNext ? '#fff' : 'var(--surface-hover)',
 fontWeight: 700, fontSize: '.75rem', cursor: hasNext ? 'pointer' : 'default'
 }}>Next &rarr;</button>
 <button onClick={onClose} style={{
 padding: '7px 12px', borderRadius: '8px', border: '1px solid var(--surface-hover)',
 background: '#0f1520', color: 'var(--sub)', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', lineHeight: 1
 }}>x</button>
 </div>
 </div>
 <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
 {['sample', 'structure'].map(t => (
 <button key={t} onClick={() => setTab(t)} style={{
 padding: '6px 16px', borderRadius: '8px', border: '1px solid',
 borderColor: tab === t ? '#6366f1' : 'var(--surface-hover)',
 background: tab === t ? 'rgba(99,102,241,0.15)' : 'transparent',
 color: tab === t ? '#a5b4fc' : 'var(--sub)',
 fontWeight: 700, fontSize: '.75rem', cursor: 'pointer'
 }}>
 {t === 'sample' ? (lang === 'sw' ? 'Mfano Kamili' : 'Full Sample') : (lang === 'sw' ? 'Muundo' : 'Structure')}
 </button>
 ))}
 </div>
 </div>
 <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
 {tab === 'sample' ? (
 <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', padding: '20px 24px' }}>
 {item.sample.split('\n\n').map((para, i) => (
 <p key={i} style={{ color: 'var(--text)', fontSize: '.88rem', lineHeight: 1.9, margin: '0 0 14px', whiteSpace: 'pre-line' }}>{para}</p>
 ))}
 </div>
 ) : (
 <div>
 <p style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--sub)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '12px' }}>
 {lang === 'sw' ? 'Muundo wa Kuandika' : 'Writing Structure'}
 </p>
 {item.structure.map((s, i) => (
 <div key={i} style={{
 display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '10px 0',
 borderBottom: i < item.structure.length - 1 ? '1px solid var(--border)' : 'none'
 }}>
 <span style={{
 background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', borderRadius: '6px',
 padding: '2px 8px', fontSize: '.7rem', fontWeight: 800, flexShrink: 0, minWidth: '24px', textAlign: 'center'
 }}>{i + 1}</span>
 <span style={{ color: 'var(--text)', fontSize: '.88rem', lineHeight: 1.5 }}>{s}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 </div>
 )
}

function LangSection({ langLabel, langKey, data, onSelect, accent, flag }) {
 return (
 <div style={{ marginBottom: '52px' }}>
 <div style={{
 display: 'flex', alignItems: 'center', gap: '14px',
 marginBottom: '28px', paddingBottom: '16px',
 borderBottom: `2px solid ${accent}33`
 }}>
 <span style={{ fontSize: '1.8rem' }}>{flag}</span>
 <div style={{ flex: 1 }}>
 <h2 style={{ fontWeight: 900, color: 'var(--text)', margin: 0, fontSize: '1.5rem' }}>{langLabel}</h2>
 <p style={{ color: 'var(--sub)', fontSize: '.78rem', margin: 0 }}>
 {Object.values(data).reduce((a, c) => a + c.types.length, 0)} types &nbsp;.&nbsp; {Object.keys(data).length} categories
 </p>
 </div>
 </div>
 {Object.entries(data).map(([catKey, catVal]) => (
 <div key={catKey} style={{ marginBottom: '32px' }}>
 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
 <span style={{ fontSize: '1.1rem' }}>{catVal.emoji}</span>
 <div style={{ flex: 1 }}>
 <h3 style={{ fontWeight: 800, color: '#e5e7eb', margin: 0, fontSize: '1rem' }}>{catKey}</h3>
 <p style={{ color: 'var(--sub)', fontSize: '.72rem', margin: 0 }}>{catVal.desc}</p>
 </div>
 <span style={{
 background: `${accent}22`, color: accent,
 fontSize: '.68rem', fontWeight: 800, padding: '3px 10px',
 borderRadius: '20px', border: `1px solid ${accent}44`
 }}>{catVal.types.length} types</span>
 </div>
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '10px' }}>
 {catVal.types.map(t => (
 <button key={t.id} onClick={() => onSelect(t, langKey)}
 onMouseEnter={e => { e.currentTarget.style.borderColor = accent; e.currentTarget.style.background = `${accent}11` }}
 onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--surface-hover)'; e.currentTarget.style.background = 'var(--bg)' }}
 style={{
 background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '12px',
 padding: '14px 16px', cursor: 'pointer', textAlign: 'left',
 transition: 'border-color .15s, background .15s', width: '100%'
 }}>
 <p style={{ fontWeight: 700, color: 'var(--text)', fontSize: '.88rem', margin: '0 0 4px' }}>{t.label}</p>
 <p style={{ color: 'var(--sub)', fontSize: '.7rem', margin: 0 }}>{t.desc}</p>
 </button>
 ))}
 </div>
 </div>
 ))}
 </div>
 )
}

// flat list for Prev / Next navigation across all writing types
const ALL_WRITING = [
 ...Object.values(ENGLISH).flatMap(cat => cat.types.map(t => ({ item: t, lang: 'en' }))),
 ...Object.values(KISWAHILI).flatMap(cat => cat.types.map(t => ({ item: t, lang: 'sw' }))),
]

export default function Writing() {
 const [modalIdx, setModalIdx] = useState(null)
 const modal = modalIdx !== null ? ALL_WRITING[modalIdx] : null

 function openWriting(item, lang) {
  const idx = ALL_WRITING.findIndex(w => w.item.id === item.id && w.lang === lang)
  setModalIdx(idx >= 0 ? idx : 0)
 }

 return (
 <div style={{ background: bg, minHeight: '100vh', padding: '28px 24px' }}>
 {modal && (
  <Modal
   item={modal.item}
   lang={modal.lang}
   onClose={() => setModalIdx(null)}
   hasPrev={modalIdx > 0}
   hasNext={modalIdx < ALL_WRITING.length - 1}
   onPrev={() => setModalIdx(i => i - 1)}
   onNext={() => setModalIdx(i => i + 1)}
  />
 )}
 <div style={{ maxWidth: '780px', margin: '0 auto' }}>
 <div style={{ marginBottom: '40px' }}>
 <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text)', margin: '0 0 8px' }}> Writing</h1>
 <p style={{ color: 'var(--sub)', margin: 0, fontSize: '.88rem' }}>
  Click any card to view a full sample and writing structure guide
 </p>
 </div>
 <LangSection langLabel="English" langKey="en" data={ENGLISH}
  onSelect={openWriting} accent="#6366f1" flag="" />
 <LangSection langLabel="Kiswahili" langKey="sw" data={KISWAHILI}
  onSelect={openWriting} accent="#10b981" flag="" />
 </div>
 </div>
 )
}
