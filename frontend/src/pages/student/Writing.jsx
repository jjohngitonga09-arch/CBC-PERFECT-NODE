import { useState } from 'react'

const bg = 'var(--bg)'

const ENGLISH = {
 Personal: {
  desc: 'About yourself and your life',
  types: [
   {
    id: 'journal', label: 'Journal', desc: 'Daily thoughts and feelings',
    structure: ['Date', 'Mood / Weather', 'What happened today', 'What I felt', 'What I learned or wish for'],
    sample: `Monday, 5th May 2025\nMood: Quietly joyful. Weather: A sky washed clean after morning rain.\n\nToday began with the kind of light that makes even ordinary things look hopeful. I woke before the alarm, pulled on my school sweater, and stepped outside to see the world still dripping from last night’s storm. Our road had turned into a shallow river, and the air smelled of wet earth and crushed jasmine. Small children were already splashing through the puddles, laughing as if the rain had washed away all their worries.\n\nAt school, something small but significant happened. Our biology teacher, Mrs. Wambui, brought a human skeleton into the classroom. Not a plastic one – a real one, old and yellowed, borrowed from the university. I touched a rib bone with my fingertip and felt a shiver travel from my hand all the way to my heart. It was strange and wonderful to think that inside each of us there is something so solid and delicate at the same time. She explained how the bones tell stories of the person’s life – tiny marks that show where muscles attached, where injuries healed, where growth happened. I had never thought of a skeleton as a book, but now I could not unsee it.\n\nDuring lunch, I sat under the jacaranda tree with my friend Otieno. He told me his father had been sick again and that money was tight. I didn't know what to say, so I just listened. Sometimes that is the best gift you can give someone. He seemed lighter afterward, as if sharing the weight had cut it in half.\n\nOn the walk home, the sun came out properly for the first time all day. The puddles reflected the clouds like pieces of sky had fallen to the ground. I stopped on the bridge over the Nairobi River and watched a kingfisher dive for its supper. It missed three times, but on the fourth try it came up with something silver wriggling in its beak. Persistence, I thought. That bird knew the river better than any of us.\n\nI feel a quiet joy tonight, the kind that doesn't shout but settles in your bones. I learned that listening is love, and that even the most ordinary Monday can be full of miracles if you pay attention.\n\nTomorrow I will finish my history essay and remember to thank Mrs. Wambui for bringing the skeleton. I also want to check on Otieno.`
   },
   {
    id: 'diary', label: 'Diary Entry', desc: 'Private daily record',
    structure: ['Dear Diary,', 'Date', 'What happened', 'How I felt', 'What I hope for tomorrow'],
    sample: `Dear Diary,\n\nWednesday, 7th May 2025\n\nSomething happened today that I'm still turning over in my mind. It wasn't big or dramatic – no one shouted or cried – but it shifted something inside me, like a door opening just a crack and letting in light.\n\nIt started during the lunch break. I was sitting alone on the low wall near the basketball court, eating my chapati and beans, when a girl from Form One came and sat near me. She didn't say anything at first; she just watched the older boys playing. Her uniform was too big, the sleeves rolled up several times, and she had a small hole in her right sock. She looked so young and so alone that something in my chest ached.\n\nAfter a while, she said, "Do you ever feel like you're invisible?"\n\nI turned to look at her. She had big serious eyes and a mouth that looked like it was holding back a thousand words. I remembered being that age – how everything felt new and terrifying, how I thought everyone else had a secret manual for life that I had never been given. I remembered eating lunch alone, walking home alone, feeling like a ghost in a crowd.\n\n"Yes," I said. "I used to feel that way all the time."\n\nShe looked at me with something like hope. "Did it go away?"\n\n"Not completely. But it got quieter. And then one day you look around and realise there are people who see you, even if you didn't notice them noticing."\n\nWe sat together for the rest of the break, not talking much, just watching the game and sharing the last of my chapati. Before the bell rang, she smiled and said, "Thank you for seeing me." Then she ran off toward the classrooms, her oversized blazer flapping behind her.\n\nI walked through the rest of the day feeling strange and full. As if by simply being there and telling the truth about my own experience, I had given her something she really needed. I wanted to cry but also to laugh.\n\nTonight I realise that we never know when a small moment of honesty will become a gift to someone else. Tomorrow I hope to see her again. Maybe I'll learn her name. And maybe I'll tell her that she made me feel a little less invisible too.`
   },
   {
    id: 'cv', label: 'CV / Resume', desc: 'Your skills and experience',
    structure: ['Full Name & Contacts', 'Personal Profile', 'Education', 'Skills', 'Hobbies & Interests', 'References'],
    sample: `AMARA WANJIKU ODHIAMBO\nNairobi, Kenya | amara.odhiambo@email.com | 0712 345 678\n\nPERSONAL PROFILE\nI am a dedicated and curious Form Four student with a deep passion for the sciences and a growing interest in healthcare. My teachers describe me as reliable, detail‑oriented, and quietly determined. I thrive in environments that require both independent thinking and teamwork, and I am always eager to learn from those around me. I believe that hard work, honesty, and compassion are the foundations of any meaningful career, and I bring these values to everything I do.\n\nEDUCATION\nNairobi Girls High School, Nairobi | 2021 – Present\nKenya Certificate of Secondary Education (KCSE) – Expected Grade: A\nKey subjects: Biology, Chemistry, Mathematics, English, Kiswahili\n\nSunshine Primary School, Nairobi | 2013 – 2020\nKenya Certificate of Primary Education (KCPE) – Score: 398/500\n\nSKILLS\n- Strong communication skills in English and Kiswahili, both spoken and written.\n- Proficient in Microsoft Office (Word, Excel, PowerPoint) and basic graphic design with Canva.\n- First Aid certified (Kenya Red Cross, 2024).\n- Leadership experience as Health Prefect and organiser of school health week.\n- Basic laboratory skills gained through school science club.\n\nHOBBIES & INTERESTS\nReading (especially biographies and science fiction), creative writing, environmental conservation, playing netball, and volunteering at a local children's home.\n\nREFERENCES\nAvailable upon request.`
   },
   {
    id: 'biography', label: 'Biography', desc: "Someone else's life story",
    structure: ['Introduction', 'Early Life', 'Education & Career', 'Major Achievements', 'Challenges Faced', 'Legacy'],
    sample: `Wangari Maathai: The Woman Who Planted Hope\n\nWangari Muta Maathai was one of the most extraordinary women Africa has ever produced. Scientist, activist, and Nobel Peace Prize laureate, she dedicated her entire life to the belief that caring for the earth and fighting for justice are the same struggle. Her story is not just about trees; it is about courage, resilience, and the power of ordinary people to change the world.\n\nBorn on 1st April 1940 in Nyeri, Kenya, Wangari grew up in the lush highlands near Mount Kenya. Her earliest memories were of clear streams and ancient trees that seemed to hold up the sky. She would later say that watching those streams dry up as forests were cut down broke something open inside her – a wound that became her life's work.\n\nShe excelled academically and won a scholarship to study in the United States, where she earned a bachelor's degree in biology. She returned to Kenya and, in 1971, became the first woman in East and Central Africa to earn a doctorate, from the University of Nairobi. She later became a professor and department chair – another first for a woman in the region. But it was outside the lecture halls that her greatest work began.\n\nIn 1977, she founded the Green Belt Movement, a grassroots organisation that mobilised thousands of women across Kenya to plant trees. Over decades, more than fifty million trees were planted, restoring watersheds, providing women with income and dignity, and creating a model of environmental activism that spread across the continent. She faced imprisonment, beatings, and public ridicule from the government of Daniel arap Moi. She refused to be silenced.\n\nIn 2004, she became the first African woman to win the Nobel Peace Prize. She died in 2011, but her trees still stand – and in every one of them, a story of courage, patience, and hope lives on. She taught the world that a single seed, placed in the ground with love and conviction, can grow into a movement.`
   },
   {
    id: 'auto', label: 'Autobiography', desc: 'Your own life story',
    structure: ['Introduction', 'Early Childhood', 'Growing Up', 'Important Events', 'Goals & Dreams', 'Conclusion'],
    sample: `My Story: A Life Still Being Written\n\nMy name is Kofi James Mutua, and I was born on a rainy Tuesday morning in Kisumu, the third child of four. My mother tells me I came into the world quietly, as if I were listening first before deciding to announce myself. Perhaps that is still who I am.\n\nMy earliest memory is of my grandmother's kitchen – the smell of ugali bubbling in a heavy pot, the orange glow of the jiko, her voice low and steady telling stories I could not fully understand but felt deep in my chest. Those evenings by the fire shaped my imagination more than any book ever would. She spoke of ancestors and hyenas, of clever hares and foolish lions, and I learned that stories are the thread that stitches a family together across time.\n\nI grew up in a modest household where books were treated like guests of honour. My father, a secondary school teacher, believed that education was the one gift no one could ever take from you. He installed that belief in me like a foundation stone, and it has held ever since.\n\nWhen I was twelve, my father fell seriously ill and could not work for nearly a year. I watched my mother carry the entire family on her back without a single complaint. She sold vegetables at the market, mended clothes, and still found time to check my homework. That year taught me more about strength and love than any classroom ever has.\n\nToday I am in Form Three, studying hard, dreaming bigger. I want to become an engineer and design clean water systems for rural communities. I want to see children in remote villages turn on a tap and watch clean water flow – something I know is not a luxury but a basic human right.\n\nMy story is still being written, one decision, one day at a time. I intend to make it worth reading. And maybe one day, a grandchild of mine will sit by a fire and hear this story and know that ordinary people can do extraordinary things.`
   },
   {
    id: 'statement', label: 'Personal Statement', desc: 'For applications / admissions',
    structure: ['Opening hook', 'Why this programme?', 'Strengths & achievements', 'What you will contribute', 'Closing statement'],
    sample: `From the moment I first looked through a microscope and saw a universe invisible to the naked eye, I knew that science was not just a subject I studied – it was a language I spoke naturally.\n\nI am applying to study Medicine at the University of Nairobi because I believe that good health is the foundation on which every other human ambition rests. Growing up in a village where the nearest hospital was forty kilometres away, I saw how the absence of accessible healthcare limits lives, cuts stories short, and forces families to make impossible choices. I remember a neighbour who died of a simple infection because the nearest clinic had run out of antibiotics. I was nine years old, and that was the moment I decided to become a doctor.\n\nThroughout my time at Lenana School, I have maintained a strong academic record, consistently ranking in the top five percent of my class in Biology, Chemistry, and Mathematics. Beyond academics, I have served as health prefect for two years, coordinating wellness campaigns and first aid training for over three hundred students. I also volunteered at Kenyatta National Hospital's outpatient department every school holiday for the past two years, assisting with patient registration and shadowing nurses. Those experiences taught me that healing is not only about prescriptions and procedures; it is about looking a person in the eye and making them feel seen.\n\nI am a patient listener and a calm presence – qualities I believe are as essential to medicine as technical skill. I am ready to work hard, to learn humbly, and to serve with everything I have. I know the road will be long, but I am prepared to walk it.\n\nMedicine is not my plan B. It is the only plan I have ever had, and I will not rest until I can place a stethoscope on someone's chest and tell them, "You are going to be okay."`
   },
   {
    id: 'narrative', label: 'Personal Narrative', desc: 'A true story from your life',
    structure: ['Setting the scene', 'The event', 'Your feelings & thoughts', 'The turning point', 'What you learned'],
    sample: `The Day I Nearly Gave Up\n\nIt was a Thursday morning in March, the kind that arrives grey and indifferent. I sat at my desk before the mathematics examination, staring at my revision notes without really seeing them. My hands were cold. My mind was a blank white room. For three months I had been failing mathematics – not by a little, but by a great, humiliating margin. Each marked paper returned to me felt like a door being shut in my face. My classmates seemed to understand things that I could not grasp no matter how many times I read them. I had begun to believe, quietly and with certainty, that I was simply not capable.\n\nThat morning, something shifted. My teacher, Mr. Otieno, stopped beside my desk before the papers were handed out. He said nothing dramatic. He just said, "You have been working harder than you know, Akinyi." Then he moved on. Those eight words cracked something open inside me. I realised that someone else could see the effort I was making – even when I could not see it myself.\n\nI sat the examination differently that day. Not confidently, but present. I did not leave any question blank. I wrote something for every problem, even if it was only my working. I finished with ten minutes to spare. When the results came back, I had passed. Not perfectly. But I passed. And more importantly, I stopped telling myself the story that I was the girl who would never understand mathematics.\n\nThat day I learned that the story we tell ourselves about our own abilities is the most powerful story of all – and we are allowed to rewrite it, one small victory at a time. Every time I sit down to study now, I hear Mr. Otieno's voice in my head, and I keep going.`
   },
  ]
 },
 Letters: {
  desc: 'All types of letters in English',
  types: [
   {
    id: 'formal', label: 'Formal Letter', desc: 'To officials, companies, schools',
    structure: ['Your address', 'Date', 'Recipient address', 'Salutation', 'Introduction', 'Body', 'Closing', 'Yours faithfully'],
    sample: `14 Acacia Road\nWestlands\nNairobi\n14th May 2025\n\nThe Principal\nGreenfields Secondary School\nP.O. Box 4521\nNairobi\n\nDear Sir/Madam,\n\nRE: Application for School Transfer\n\nI am writing to formally request a transfer for my daughter, Melissa Achieng, currently enrolled in Form Two at Riverside Girls High School. Due to a change in our family's place of residence, it is no longer practical for Melissa to continue attending her current school, which now requires a daily commute of over two hours each way. This has begun to affect her punctuality and overall well-being.\n\nMelissa is a dedicated student with a strong academic record, consistently achieving marks above seventy percent across all core subjects. Her current class teacher describes her as diligent, cooperative, and a positive influence on her peers. She is also an active member of the school's debate team and environmental club, demonstrating leadership and a commitment to community service.\n\nI have enclosed her most recent academic transcripts, a recommendation letter from her class teacher, and copies of relevant identification documents. I am available for a meeting at your earliest convenience to discuss the transfer process in detail and to provide any further information you may require.\n\nI trust that you will consider this application favourably and look forward to your response.\n\nYours faithfully,\n\nMargaret Achieng\nParent / Guardian`
   },
   {
    id: 'informal', label: 'Informal / Friendly', desc: 'To friends and family',
    structure: ['Your address', 'Date', 'Dear [Name],', 'Opening', 'News / story', 'Questions', 'Closing', 'Your friend'],
    sample: `Flat 3, Mombasa Road\nNairobi\n10th May 2025\n\nDear Josephine,\n\nI hope this letter finds you well and that life in Mombasa is treating you kindly. It feels like forever since we last saw each other – I still think about that afternoon we spent at the beach eating grilled maize and laughing until our stomachs hurt! Do you remember the old man selling coconut slices and how he tried to teach us that song about the ocean? I still hum it sometimes.\n\nThings here have been busy but good. School has been intense, especially with mock examinations coming up in two weeks. I have been spending most evenings at the library, which sounds very serious, but honestly I spend half the time drawing in the margins of my notebook and the other half actually studying. Last weekend my family visited the Nairobi National Park for the first time in years. We saw three lions resting under an acacia tree, completely unbothered by the world. I envied them a little. I wish I could nap in the sun like that without a single worry.\n\nHow is your school going? Have you joined any new clubs this term? I remember you were thinking about joining the swimming team – did that happen? And how is your grandmother? Please write and tell me everything. I miss our long conversations and your terrible jokes.\n\nI am already looking forward to the December holidays when we can hopefully meet again and spend whole days doing absolutely nothing together. Maybe we can go back to that same beach.\n\nWrite soon!\n\nYour friend,\nNjeri`
   },
   {
    id: 'application', label: 'Application Letter', desc: 'Applying for a job or school',
    structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'Position applied for', 'Qualifications', 'Why you are best', 'Request interview', 'Yours faithfully'],
    sample: `22 Ngong Road\nKaren\nNairobi\n12th May 2025\n\nThe Human Resources Manager\nSafaricom PLC\nP.O. Box 66827\nNairobi\n\nDear Sir/Madam,\n\nRE: Application for Customer Experience Internship\n\nI am writing to apply for the Customer Experience Internship position advertised on your company website on 5th May 2025. I am a final-year Bachelor of Commerce student at the University of Nairobi, majoring in Marketing, and I believe I have both the academic grounding and the personal qualities to contribute meaningfully to your team.\n\nThroughout my studies I have maintained a consistent grade point average of 3.7 out of 4.0 and completed coursework in consumer behaviour, digital marketing, and service management. During my second year, I completed a successful two-month placement at a local telecommunications firm where I assisted in managing customer queries and contributed to a fifteen percent improvement in resolution time. This experience taught me the value of patience, active listening, and clear communication.\n\nI am a strong communicator, fluent in English and Kiswahili, and am comfortable with CRM systems and Microsoft Office. More importantly, I am genuinely enthusiastic about customer experience – I believe that every interaction is an opportunity to build trust and loyalty, and I treat every customer as I would want my own family to be treated.\n\nI would welcome the opportunity to discuss my application further. I am available for an interview at any time convenient to you.\n\nYours faithfully,\n\nBrian Kamau\nTel: 0723 456 789`
   },
   {
    id: 'complaint', label: 'Complaint Letter', desc: 'Reporting a problem formally',
    structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'State the problem', 'Give details & dates', 'Impact on you', 'Expected action', 'Yours faithfully'],
    sample: `8 Riverside Drive\nLavington\nNairobi\n9th May 2025\n\nThe Customer Service Manager\nNairobi Water and Sewerage Company\nP.O. Box 30655\nNairobi\n\nDear Sir/Madam,\n\nRE: Persistent Water Supply Interruption – Account Number NW/2034/LV\n\nI am writing to formally complain about the severe and persistent interruption to water supply at my residential address above. For the past three weeks, since approximately 18th April 2025, our estate has experienced water supply for fewer than four hours per day, often between midnight and 4 a.m., making it impossible to access water during normal waking hours.\n\nI have reported this issue twice by telephone – on 22nd April and again on 2nd May – and was each time assured that the matter would be resolved within 48 hours. To date, no meaningful improvement has occurred. Our household of six people, including two young children and an elderly parent, has been significantly inconvenienced and forced to purchase water at considerable expense, straining our monthly budget.\n\nI kindly request that this matter be investigated urgently and that a technician be dispatched within three working days. I also request a written explanation of the cause of the disruption and the steps being taken to prevent future recurrence. I trust that a company of your standing will handle this with the seriousness it deserves.\n\nI look forward to your prompt response.\n\nYours faithfully,\n\nPeter Ndirangu\nTel: 0700 123 456`
   },
   {
    id: 'thankyou', label: 'Thank You Letter', desc: 'Expressing gratitude formally',
    structure: ['Your address & date', 'Recipient address', 'Dear [Name],', 'Express thanks', 'Specific reason', 'Impact', 'Future hopes', 'Yours sincerely'],
    sample: `16 Kileleshwa Close\nNairobi\n8th May 2025\n\nMr. James Waweru\nHead of Department, Sciences\nAlliance High School\nP.O. Box 1001, Kikuyu\n\nDear Mr. Waweru,\n\nI am writing to express my sincere and heartfelt gratitude for the exceptional support and encouragement you provided me throughout my final year at Alliance High School.\n\nWhen I joined Form Four, I was deeply uncertain about my ability to perform well in Physics and Chemistry. I had always found the sciences challenging, and I carried a quiet fear that I would not measure up. Your patience, clear explanations, and genuine belief in my potential made an enormous difference. You gave up lunch breaks to offer extra lessons, marked my practice papers with detailed feedback, and never once made me feel that my questions were too basic or too many. I remember one afternoon when you stayed until 6 p.m. helping me understand a concept I had struggled with for weeks. You never rushed me.\n\nWhen my KCSE results were released and I achieved an A in both sciences, the first person I thought of was you. That result does not belong to me alone – it belongs to you as well. You saw something in me that I had not yet learned to see in myself.\n\nI am now preparing to study Engineering at the University of Nairobi, and I carry your lessons with me – not just about Physics, but about perseverance and the dignity of hard work. I hope you know what a lasting difference a dedicated teacher makes.\n\nYours sincerely,\n\nDaniel Otieno`
   },
   {
    id: 'enquiry', label: 'Enquiry Letter', desc: 'Asking for information',
    structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'What you need', 'Specific questions', 'How to respond', 'Thank them', 'Yours faithfully'],
    sample: `5 Thika Road\nRoysambu\nNairobi\n11th May 2025\n\nThe Admissions Officer\nKenya Medical Training College\nP.O. Box 30195\nNairobi\n\nDear Sir/Madam,\n\nRE: Enquiry Regarding Nursing Programme Admissions for 2026\n\nI am writing to request information regarding the requirements and application process for the Certificate in Nursing programme at your institution for the academic year beginning January 2026.\n\nI am currently completing my Kenya Certificate of Secondary Education examinations and am keen to pursue a career in healthcare. I would be grateful if you could provide me with the following information:\n\n1. The minimum KCSE grade required for admission to the Nursing programme.\n2. The specific subject requirements, particularly whether Biology and Chemistry are mandatory.\n3. The application deadline and process for the January 2026 intake.\n4. Whether bursaries or financial assistance are available for qualifying students.\n\nI would appreciate it if you could respond by email at the address below or by post to the address above. I am also happy to visit the institution in person if that would be more convenient.\n\nThank you in advance for your assistance. I look forward to hearing from you and am excited about the possibility of joining your programme.\n\nYours faithfully,\n\nGrace Muthoni\nEmail: grace.muthoni@email.com`
   },
   {
    id: 'request', label: 'Request Letter', desc: 'Asking for something politely',
    structure: ['Your address & date', 'Recipient address', 'Dear Sir/Madam,', 'What you are requesting', 'Reasons', 'Supporting info', 'Thank them', 'Yours faithfully'],
    sample: `23 Jogoo Road\nEastleigh\nNairobi\n13th May 2025\n\nThe Librarian\nNairobi City Library\nP.O. Box 14091\nNairobi\n\nDear Sir/Madam,\n\nRE: Request for Extended Borrowing Period\n\nI am writing to kindly request an extension of the borrowing period for three books I currently hold on my library card (Card No. NCL/4872). The books are: Organic Chemistry by Morrison and Boyd, A Guide to Cell Biology by Alberts, and Introduction to Genetics by Lewin.\n\nI borrowed these books on 20th April 2025 for a period of three weeks in preparation for my KCSE mock examinations. Due to an unexpected illness that kept me away from my studies for ten days, I have been unable to make adequate use of these resources within the original borrowing period. I am now fully recovered and determined to catch up, but I need a little more time.\n\nI would be very grateful if the borrowing period could be extended by two additional weeks, until 10th June 2025. I assure you that I will return the books promptly and in good condition. I understand that other patrons may be waiting for these materials, and I sincerely appreciate your understanding of my circumstances.\n\nThank you for your time and consideration.\n\nYours faithfully,\n\nSamuel Kipchoge\nTel: 0711 234 567`
   },
   {
    id: 'cover', label: 'Cover Letter', desc: 'Sent with a CV or application',
    structure: ['Your address & date', 'Recipient address', 'Dear Hiring Manager,', 'Introduce yourself & role', 'Top skills', 'Why this company', 'Call to action', 'Yours sincerely'],
    sample: `17 Ngong Avenue\nKilimani\nNairobi\n15th May 2025\n\nThe Recruitment Manager\nNation Media Group\nP.O. Box 49010\nNairobi\n\nDear Hiring Manager,\n\nRE: Application for Junior Graphic Designer Position (Ref: NMG/GD/2025)\n\nI am writing to apply for the Junior Graphic Designer position advertised on your website on 8th May 2025. I am a recent graduate of the Kenya Polytechnic University College with a Diploma in Graphic Design and Communication, and I am excited about the opportunity to contribute my skills to one of East Africa's most respected media organisations.\n\nDuring my studies and subsequent freelance work, I developed strong competency in Adobe Illustrator, Photoshop, and InDesign, and built a portfolio spanning editorial layouts, brand identity projects, and digital campaign materials. One of my designs was selected for use in a national health awareness campaign run by the Ministry of Health in 2024 – an experience that taught me how design can communicate messages that truly matter and impact millions of lives.\n\nNation Media Group's commitment to quality visual storytelling and your recent expansion into digital platforms align perfectly with my ambitions and skills. I am eager to grow within an environment that values creativity, collaboration, and impact. I am not just looking for a job; I am looking for a place where my work can help inform and inspire a nation.\n\nI have attached my CV and a link to my portfolio. I would welcome the opportunity to discuss how I can contribute to your design team.\n\nYours sincerely,\n\nFatuma Hassan\nTel: 0733 567 890`
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
    sample: `Jumanne, 6 Mei 2025\n\nMpendwa Shajara,\n\nLeo ilikuwa siku ya ajabu – mchanganyiko wa furaha na huzuni ambao haukutarajiwa. Asubuhi niliamka mapema kwa sababu nilikuwa na mtihani wa Kiswahili. Nilikuwa nimesoma hadi usiku wa manane na macho yangu yalikuwa mazito kama mawe, lakini moyo wangu ulikuwa tayari.\n\nMtihani ulienda vizuri kuliko nilivyotarajia. Swali la insha lilikuwa kuhusu umuhimu wa lugha ya mama, na maneno yalikuja kwangu kwa urahisi, kana kwamba yalikuwa yakiningojea ndani ya moyo wangu. Mwalimu Awino alisimama nyuma yangu kwa muda na kisha akaendelea – ishara ndogo ambayo ilinijaza matumaini. Nilihisi kama nilikuwa ninazungumza na karatasi, si kuiandikia tu.\n\nWakati wa mapumziko ya mchana, nilipata habari kwamba shangazi yangu mpendwa, Mama Zawadi, alikuwa hospitalini. Moyo wangu ulizama. Yeye ndiye aliyenifundisha kupika, kuimba, na kusimulia hadithi. Ni nguzo katika maisha yangu, mtu ambaye amekuwa kivuli changu tangu utotoni.\n\nNilikwenda kumwona baada ya shule. Alikuwa amekaa kitandani, dhaifu lakini akitabasamu. Aliponiona, alisema, "Umekuja." Maneno mawili tu, lakini yalijaa upendo mwingi. Nilikaa karibu yake kwa saa moja, tukizungumza kuhusu siku za zamani na mambo madogo madogo. Kuwa naye kulifanya kila kitu kihisi sawa.\n\nUsiku huu nina shukrani moyoni – kwa mtihani ulioenda vizuri, kwa shangazi aliye hai, na kwa uwezo wa kuandika hisia zangu mahali ambapo zinaweza kupumzika salama. Kesho natumaini habari nzuri kutoka hospitalini na kwamba Mama Zawadi atarudi nyumbani hivi karibuni. Nitamletea chai na kumwambia jinsi nilivyomkosa.`
   },
   {
    id: 'wasifu', label: 'Wasifu wa Kibinafsi', desc: 'Historia ya maisha yako',
    structure: ['Utangulizi', 'Utoto wangu', 'Ukuaji wangu', 'Matukio muhimu', 'Malengo na ndoto zangu', 'Hitimisho'],
    sample: `Mimi Ni Nani: Hadithi ya Maisha Yangu\n\nJina langu ni Amina Halima Osei, na nilizaliwa tarehe 3 Machi 2008 katika mji wa Mombasa, mtoto wa kwanza kati ya watoto watatu. Mama yangu ni muuguzi na baba yangu ni mwalimu wa hesabu – watu wawili walionipatia fursa ya kupenda maarifa tangu utotoni.\n\nUtoto wangu ulikuwa na furaha na changamoto kwa pamoja. Tuliishi karibu na bahari, na kumbukumbu zangu za mapema zimejaa harufu ya chumvi, kelele za mawimbi, na michezo ya jioni kwenye mchanga. Bibi yangu alikuwa msimulizi bora – masimulizi yake ya usiku yalibeba hekima na ucheshi kwa pamoja, na yalilima mbegu ya upendo wa hadithi ndani yangu. Nilijifunza kwamba hadithi ni uzi unaoshona familia pamoja.\n\nNilianza shule ya msingi nikiwa na miaka sita. Nilijikuta nikipenda masomo ya Kiswahili na Sayansi zaidi ya yote. Darasa la tano niliandika hadithi fupi ambayo mwalimu wangu aliisoma mbele ya shule yote – siku ile niliamua kwamba siku moja nitakuwa mwandishi.\n\nKipindi kigumu kilikuja mwaka 2020 wakati baba yangu alipopoteza kazi kwa muda kwa sababu ya janga la COVID-19. Nilijifunza mengi kuhusu uvumilivu na umoja wa familia katika kipindi hicho. Mama alifanya kazi zote za nyumbani na bado alitafuta njia za kutulea. Niliona nguvu ya mwanamke, na niliamua kuwa kama yeye.\n\nLeo nasomea Kidato cha Tatu, nikiwa na ndoto ya kusomea Uandishi wa Habari chuo kikuu. Nataka kutumia kalamu yangu kusimamia ukweli na kuwasiliana na watu wa makabila yote. Hadithi yangu bado inaandikwa – na ninatazamia kila ukurasa ujao kwa moyo wazi.`
   },
   {
    id: 'cv_sw', label: 'CV / Wasifu wa Kazi', desc: 'Ujuzi na uzoefu wako',
    structure: ['Jina Kamili na Mawasiliano', 'Wasifu Mfupi', 'Elimu', 'Ujuzi', 'Shughuli & Maslahi', 'Marejeo'],
    sample: `OMAR ABDALLAH HASSAN\nMombasa, Kenya | omar.hassan@barua.com | 0721 678 901\n\nWASIFU MFUPI\nMimi ni mwanafunzi wa Kidato cha Nne mwenye bidii na nia ya kupata uzoefu wa kazi. Nina uwezo mzuri wa mawasiliano, kazi ya timu, na kutatua matatizo. Ninatafuta fursa ya kujifunza na kuchangia katika mazingira ya kazi ya kweli.\n\nELIMU\nShule ya Sekondari ya Mama Ngina, Mombasa | 2021 – Sasa\nCheti cha Elimu ya Sekondari (KCSE) – Inatarajiwa: B+\nMasomo Makuu: Kiswahili, Biologia, Hesabu, Fizikia, Kiingereza\n\nShule ya Msingi ya Mvita, Mombasa | 2013 – 2020\nCheti cha Msingi (KCPE) – Alama: 387/500\n\nUJUZI\n- Mawasiliano mazuri kwa Kiswahili na Kiingereza (mdomo na maandishi)\n- Ujuzi wa kompyuta: Microsoft Word, Excel, Mtandao\n- Uongozi: Mkuu wa Madarasa Darasa la Tisa na Kumi\n- Msaidizi wa kliniki ya shule (mwaka 2024)\n\nSHUGHULI NA MASLAHI\nUshairi, mpira wa miguu, utunzaji wa mazingira, kusoma vitabu.\n\nMAREJEO\nYanapatikana kuombwa.`
   },
   {
    id: 'bio_sw', label: 'Biografia', desc: 'Historia ya mtu mwingine',
    structure: ['Utangulizi', 'Utoto na Familia', 'Elimu na Kazi', 'Mafanikio Makuu', 'Changamoto', 'Urithi wake'],
    sample: `Wangari Maathai: Mwanamke Aliyepanda Miti ya Tumaini\n\nWangari Muta Maathai alikuwa miongoni mwa wanawake mashuhuri zaidi Afrika aliwahi kuzaa. Mwanasayansi, mwanaharakati, na mshindi wa Tuzo ya Amani ya Nobel, alitumia maisha yake kuamini kwamba kutunza ardhi na kupigana kwa haki ni mapambano moja.\n\nAlizaliwa tarehe 1 Aprili 1940 huko Nyeri, Kenya, katika nyanda za kijani karibu na Mlima Kenya. Utoto wake ulijaa mito ya maji safi na misitu inayoonekana kuwa ya milele. Baadaye alisema kwamba kuona mito hiyo ikikauka misitu ilipovunjwa ilivunja kitu ndani yake – jeraha ambalo likawa kazi ya maisha yake.\n\nAlifanya vizuri sana masomoni na akapata udhamini wa kusoma Marekani. Alipata shahada ya kwanza ya biolojia, kisha akarudi Kenya. Mwaka 1971, akawa mwanamke wa kwanza Afrika ya Mashariki na Kati kupata shahada ya uzamili, kutoka Chuo Kikuu cha Nairobi. Baadaye akawa profesa – ushindi mwingine wa kwanza kwa mwanamke katika eneo hilo.\n\nMwaka 1977 alianzisha Harakati ya Mkanda wa Kijani, shirika la wananchi ambalo lilihamasisha maelfu ya wanawake kupanda miti. Kwa miongo mingi, miti zaidi ya milioni hamsini ilipandwa, ikirudisha maji ardhini na kutoa wanawake mapato na heshima. Alikabiliwa na kifungo, mapigo, na dharau kutoka serikalini. Alikataa kukimbia.\n\nMwaka 2004 akawa mwanamke wa kwanza wa Afrika kushinda Tuzo ya Amani ya Nobel. Alifariki mwaka 2011, lakini miti yake bado inasimama – na katika kila mmoja, kuna hadithi ya ujasiri, uvumilivu, na tumaini. Alionyesha ulimwengu kwamba mbegu moja, ikipandwa kwa upendo, inaweza kukua na kuwa mapinduzi.`
   },
  ]
 },
 Barua: {
  desc: 'Aina zote za barua kwa Kiswahili',
  types: [
   {
    id: 'rasmi', label: 'Barua Rasmi', desc: 'Kwa mamlaka na ofisi',
    structure: ['Anwani yako', 'Tarehe', 'Anwani ya mpokeaji', 'Mada', 'Utangulizi', 'Maudhui', 'Hatua unayohitaji', 'Wako mwaminifu'],
    sample: `Nyumba Na. 7, Barabara ya Uhuru\nNakuru\n14 Mei 2025\n\nMkuu wa Shule\nShule ya Sekondari ya Nakuru\nS.L.P 1234\nNakuru\n\nNdugu Mkuu wa Shule,\n\nMADA: OMBI LA UHAMISHO WA MWANAFUNZI\n\nNinaandika barua hii kwa heshima kubwa kuomba uhamisho wa mwanangu, Jabari Otieno, kutoka Shule ya Sekondari ya Moi hadi shule yako. Sababu ya ombi hili ni kwamba familia yetu imehamia Nakuru hivi karibuni baada ya baba yake kupata kazi ya kudumu katika mji huu. Safari ndefu ya kila siku imeanza kuathiri mahudhurio na afya yake.\n\nJabari yuko Kidato cha Pili na ana rekodi nzuri ya masomo. Katika mtihani wake wa mwisho alipata wastani wa asilimia sabini na mbili. Pia ni mwanachama wa timu ya mpira wa miguu na kilabu cha sayansi, na anajulikana kwa kuwa mwanafunzi mwenye nidhamu na heshima. Ana uwezo mkubwa wa kufanya kazi na wenzake.\n\nNimeweka nyaraka zifuatazo pamoja na barua hii: nakala ya matokeo ya masomo, cheti cha mwenendo mzuri kutoka kwa mwalimu wake wa sasa, na nakala za vitambulisho vya familia.\n\nNinaomba unifahamishe kuhusu hatua zinazofuata ili mwanangu aweze kuanza masomo yake hivi karibuni iwezekanavyo. Asante kwa ushirikiano wako.\n\nWako mwaminifu,\n\nElizabeth Otieno\nNambari ya Simu: 0722 345 678`
   },
   {
    id: 'rafiki', label: 'Barua ya Rafiki', desc: 'Kwa marafiki na familia',
    structure: ['Anwani yako', 'Tarehe', 'Mpendwa [Jina],', 'Salamu', 'Habari / hadithi', 'Maswali', 'Kufunga', 'Rafiki yako'],
    sample: `Nyumba Na. 4, Mtaa wa Makadara\nNairobi\n10 Mei 2025\n\nMpendwa Zawadi,\n\nHabari yako, rafiki yangu wa zamani! Natumaini uko salama na afya njema. Kwangu hapa Nairobi mambo yanakwenda lakini nakukumbuka kila wakati – hasa wakati naona pipi za sukari dukani kwa sababu unajua wewe ndiye aliyenifundisha kuzipenda! Bado nakumbuka jinsi tulivyokaa kwenye baraza la nyumba yenu na kula pipi hadi meno yakawa mekundu.\n\nWiki hii ilikuwa na msongo wa masomo. Tulianza mada mpya ya Kemia ambayo inaitwa Kemikali za Kikaboni na kichwa changu kimechoka kabisa. Lakini mwalimu wetu mpya, Bwana Kimani, ana njia ya kufundisha ambayo inafanya mambo magumu kuonekana rahisi. Ninashukuru kwa hilo. Anasema kujifunza si mbio bali safari, na nasikia nipo tayari kutembea.\n\nSiku ya Jumamosi tulipiga picha za darasa kwa mara ya kwanza. Nilivaa kanzu yangu ya bluu – ile unayoipenda – na matokeo yalikuwa mazuri. Nitakutumia picha moja ukiniambia anwani yako mpya.\n\nNa wewe, habari za shule na familia? Je, bado unacheza mpira wa pete? Ulikuwa bingwa! Naomba uniambie kila kitu. Pia, habari za bibi yako? Natumaini anaendelea vizuri na bado anapika chapati zile za kufa mtu.\n\nNinatumaini tutaonana likizoni kwa sababu niko tayari kwa mazungumzo marefu na chakula cha bibi!\n\nRafiki yako wa moyoni,\nAmina`
   },
   {
    id: 'ombi', label: 'Barua ya Ombi', desc: 'Kuomba kitu kwa heshima',
    structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Taja unachoomba', 'Toa sababu', 'Maelezo ya ziada', 'Shukrani za mapema', 'Wako mwaminifu'],
    sample: `Nyumba Na. 12, Mtaa wa Shauri Moyo\nMombasa\n12 Mei 2025\n\nMkurugenzi wa Elimu\nKaunti ya Mombasa\nS.L.P 4000\nMombasa\n\nNdugu Mkurugenzi,\n\nMADA: OMBI LA BURSARY YA MASOMO\n\nNinaandika barua hii kwa unyenyekevu mkubwa kuomba msaada wa fedha za masomo (bursary) kwa mwaka wa masomo 2025/2026. Ninasoma Kidato cha Tatu katika Shule ya Sekondari ya Likoni na ninahitaji msaada wa kulipa ada ya shilingi kumi na mbili elfu kwa mwaka.\n\nFamilia yangu inakabiliwa na hali ngumu ya kiuchumi baada ya baba yangu kufariki mwaka jana. Mama yangu, ambaye ni mama wa nyumbani, sasa anabeba mzigo wa kutunza familia yetu ya watoto watano peke yake. Kipato chake kidogo kinatoka kwa kazi za kilimo za msimu ambazo hazitoshi kugharamia mahitaji yetu yote. Kila siku anajitahidi, lakini ni vigumu.\n\nLicha ya hali hii ngumu, nimeweza kudumisha matokeo mazuri ya masomo. Katika mtihani wangu wa mwisho nilipata wastani wa asilimia sabini na nane. Naamini kwamba kwa msaada mdogo, nitaweza kuendelea na masomo yangu na kufikia ndoto zangu za kuwa daktari.\n\nNimeweka hati zinazohitajika pamoja na barua hii, ikiwa ni pamoja na matokeo ya masomo na hati ya kifo cha baba yangu. Asante sana kwa msaada wako wa moyo wote.\n\nWako mwaminifu,\n\nHassan Mwangi Salim`
   },
   {
    id: 'maombi', label: 'Barua ya Maombi (Kazi)', desc: 'Kuomba kazi au nafasi',
    structure: ['Anwani yako & Tarehe', 'Anwani ya mwajiri', 'Ndugu Mwajiri,', 'Nafasi unayoomba', 'Elimu & uzoefu', 'Kwa nini wewe', 'Omba mahojiano', 'Wako mwaminifu'],
    sample: `Nyumba Na. 9, Barabara ya Kenyatta\nKisumu\n11 Mei 2025\n\nMeneja wa Rasilimali Watu\nKampuni ya Uchumi wa Jamii (KUSCCO)\nS.L.P 1765\nNairobi\n\nNdugu Meneja,\n\nMADA: MAOMBI YA NAFASI YA AFISA MTENDAJI WA UCHUMI\n\nNinaomba kwa heshima nafasi ya kazi ya Afisa Mtendaji wa Uchumi iliyotangazwa katika gazeti la Daily Nation la tarehe 5 Mei 2025. Nina shahada ya Kwanza ya Biashara kutoka Chuo Kikuu cha Maseno, nikihitimu mwaka 2024 kwa daraja la pili la juu.\n\nWakati wa masomo yangu, nilifanya utafiti wa mwisho kuhusu athari za akiba za kikundi kwa maendeleo ya kiuchumi ya wanawake vijijini – utafiti ambao ulipata tuzo ya bora zaidi katika idara yangu. Pia nilifanya kazi kama mwanasiasa mdogo katika Shirika la KWFT kwa miezi minne, ambapo nilishiriki katika kutoa mafunzo ya ujasiriamali na kutembelea vikundi vya akiba.\n\nNinaamini kwamba bidii yangu, uwezo wangu wa mawasiliano kwa Kiswahili na Kiingereza, na uelewa wangu wa masuala ya uchumi wa wananchi vinafanya niwe mgombea mwema kwa nafasi hii. Ninaomba kupewa fursa ya mahojiano ili niweze kueleza zaidi uwezo wangu.\n\nAsante kwa muda wako.\n\nWako mwaminifu,\n\nLydia Auma Otieno\nSimu: 0733 456 789`
   },
   {
    id: 'shukrani', label: 'Barua ya Shukrani', desc: 'Kushukuru rasmi au kwa moyo',
    structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Toa shukrani', 'Taja sababu maalum', 'Athari ya msaada', 'Matumaini ya siku zijazo', 'Wako mwaminifu'],
    sample: `Nyumba Na. 3, Mtaa wa Parklands\nNairobi\n8 Mei 2025\n\nMwalimu Jane Wangari\nMwalimu wa Kiswahili\nShule ya Sekondari ya Alliance Girls\nS.L.P 1001, Kikuyu\n\nMpendwa Mwalimu Wangari,\n\nNinaandika barua hii kwa moyo uliojaa shukrani za kweli kwa msaada na uvumilivu wako wakati wote wa mwaka wangu wa mwisho shuleni.\n\nNilipoingia Kidato cha Nne, nilikuwa na hofu kubwa kuhusu Kiswahili – hasa sehemu ya insha na uchanganuzi wa mashairi. Wewe ulinisaidia kuelewa kwamba lugha si tu sarufi na maneno bali ni ufunuo wa utamaduni na hisia za binadamu. Umesimama muda wote bila kunichoka hata nilipouliza maswali mara nyingi. Nakumbuka alasiri moja tulipokaa pamoja ukisoma insha yangu mstari kwa mstari, ukinionyesha jinsi ya kuunda sentensi kwa uzuri. Moyo wangu ulitambua kuwa mwalimu wa kweli haachi mwanafunzi wake nyuma.\n\nNilipoona matokeo yangu ya KCSE – daraja la A katika Kiswahili – machozi yalinijia. Sikuweza kuamini. Lakini wewe uliamini kabla sijaamini mimi mwenyewe.\n\nSasa ninajiandaa kusomea Uandishi wa Habari katika Chuo Kikuu cha Nairobi, na ninajua kwamba misingi ya lugha uliyonipa itanisaidia sana. Nakushukuru kutoka moyoni. Wewe si mwalimu tu – ni mwanga.\n\nWako kwa upendo na shukrani,\nPauline Nyambura`
   },
   {
    id: 'malalamiko', label: 'Barua ya Malalamiko', desc: 'Kuripoti tatizo rasmi',
    structure: ['Anwani yako & Tarehe', 'Anwani ya mpokeaji', 'Ndugu [Jina],', 'Taja tatizo', 'Maelezo & tarehe', 'Athari kwako', 'Hatua unayotarajia', 'Wako mwaminifu'],
    sample: `Nyumba Na. 18, Barabara ya Jogoo\nEastleigh, Nairobi\n13 Mei 2025\n\nMkurugenzi Mkuu\nKampuni ya Umeme Kenya (KPLC)\nS.L.P 30099\nNairobi\n\nNdugu Mkurugenzi,\n\nMADA: MALALAMIKO KUHUSU KUKATIKA KWA UMEME MARA KWA MARA – NAMBARI YA AKAUNTI: KP/3421/EA\n\nNinaandika barua hii kuwasilisha malalamiko ya rasmi kuhusu tatizo la kukatika kwa umeme ambalo limekuwa likiendelea katika mtaa wetu tangu tarehe 20 Aprili 2025.\n\nKatika kipindi cha wiki tatu zilizopita, umeme umekuwa ukikatika kati ya mara tatu hadi tano kwa siku, kila kukatika kudumu kwa saa mbili hadi sita. Nimewasiliana na ofisi yenu kwa simu mara mbili – tarehe 25 Aprili na tena tarehe 4 Mei – na kila wakati niliahidiwa tatizo litatatuliwa ndani ya masaa ishirini na nne. Hadi leo hakuna mabadiliko.\n\nTatizo hili limeniathiri vibaya sana. Biashara yangu ndogo ya kutengeneza nguo inategemea umeme, na nimepoteza mapato ya zaidi ya shilingi thelathini elfu kutokana na kufanya kazi pungufu. Chakula changu cha jokofu pia kiliharibika mara moja. Hali hii inasababisha msongo wa mawazo na inaathiri familia yangu pia.\n\nNinaomba tatizo hili lichunguzwe haraka na litarajiwe kutatuliwa ndani ya siku tatu za kazi. Pia ninaomba fidia kwa hasara niliyopata. Ninatumaini majibu yenu ya haraka.\n\nWako mwaminifu,\n\nFatuma Abdalla\nSimu: 0700 234 567`
   },
   {
    id: 'pepe', label: 'Barua Pepe (Email)', desc: 'Ujumbe wa kielektroniki',
    structure: ['Kwa:', 'Mada:', 'Ndugu [Jina],', 'Kusudi', 'Maelezo', 'Hatua inayohitajika', 'Asante', 'Jina lako'],
    sample: `Kwa: admissions@university.ac.ke\nMada: Ombi la Taarifa za Udahili – Shahada ya Ualimu 2026\n\nNdugu Afisa wa Udahili,\n\nNinakusalimu kwa heshima na kutumainia uko salama. Ninaandika barua pepe hii kuomba taarifa za kina kuhusu mchakato wa udahili kwa programu ya Shahada ya Ualimu (B.Ed) kwa mwaka wa masomo unaoanza Januari 2026.\n\nKwa sasa ninafanya mitihani ya KCSE na ninatarajia kuhitimu hivi karibuni. Nimekuwa na ndoto ya kuwa mwalimu wa sayansi katika shule za sekondari, na ninaamini kwamba taasisi yenu ina programu bora ya kunitayarisha kwa kazi hiyo. Ningependa kufundisha vijana na kuwa kama wale walimu walionibadilishia maisha.\n\nNinaomba unifahamishe kuhusu yafuatayo:\n\n1. Masharti ya KCSE yanayohitajika kwa programu hii.\n2. Tarehe ya mwisho ya kuwasilisha maombi.\n3. Kama kuna nafasi za ufadhili au bursary kwa wanafunzi wanaostahili.\n4. Nyaraka zinazohitajika wakati wa kuwasilisha ombi.\n\nAsante sana kwa muda wako. Ninatumainia majibu yako hivi karibuni.\n\nKwa heshima,\nMohamed Sharif Abdi\nSimu: 0712 890 123\nBarua pepe: mohamed.abdi@gmail.com`
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
  Click any card to view a full, story‑like sample and its writing structure
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