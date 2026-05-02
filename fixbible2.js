const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'frontend', 'src', 'pages', 'student', 'BibleStories.jsx')

const content = `import { useState } from 'react'

const STORIES = [
  {
    id:1, title:"David and Goliath", ref:"1 Samuel 17",
    summary:"A young shepherd boy defeats a mighty giant with only a sling and stone, showing that courage and faith are stronger than size.",
    body:\`A giant soldier named Goliath stood before the army of Israel every day, challenging anyone to fight him. He was over nine feet tall, wore heavy bronze armour, and carried a spear as thick as a weaver's beam. Everyone was terrified of him -- everyone except a young shepherd boy named David.

David had come to the battlefield to bring food to his brothers. When he heard Goliath mocking the army of Israel, he was not afraid. He told King Saul that he would fight the giant himself.

Saul tried to put heavy armour on David, but it was too big and too heavy. David took it off. Instead, he went to a stream and chose five smooth stones. He carried his shepherd's sling -- the same weapon he used to protect his sheep from lions and bears.

Goliath laughed when he saw a boy walking toward him with no armour and no sword. But David called out: "You come with sword and spear, but I come in the name of the Lord!"

David ran toward Goliath, placed a stone in his sling, and whirled it with all his strength. The stone flew true and struck Goliath in the forehead. The giant crashed to the ground.

The lesson: True strength comes not from size or weapons, but from courage, faith, and the willingness to act when others are afraid.\`
  },
  {
    id:2, title:"Noah and the Ark", ref:"Genesis 6-9",
    summary:"A faithful man builds a great boat to save his family and the animals of the earth from a mighty flood.",
    body:\`Long ago, the earth had become filled with violence and cruelty. God looked at the world and was deeply saddened. But there was one man who lived differently -- a man named Noah. He was honest, kind, and faithful when everyone around him had forgotten what was right.

God spoke to Noah and told him to build a great ark -- a huge wooden boat. God gave Noah exact measurements. The ark would be as long as one and a half football fields. Noah obeyed, even though there was no rain in sight and his neighbours laughed at him every single day.

Noah and his three sons spent many years building the ark. When it was finished, God told Noah to bring his family inside, and to bring two of every kind of animal -- one male and one female -- so that life could continue after the flood.

Then the rain began. It rained for forty days and forty nights. Water covered even the tallest mountains. But the ark floated safely above it all, carrying Noah, his family, and the animals.

When the waters finally went down, a dove Noah released came back carrying a fresh olive branch -- a sign that dry land had appeared. God put a rainbow in the sky as a promise to never again flood the whole earth.

The lesson: Faithfulness and obedience, even when others mock you, leads to safety and blessing.\`
  },
  {
    id:3, title:"Joseph and His Coat", ref:"Genesis 37-45",
    summary:"A boy sold into slavery by his own brothers rises to become one of the most powerful men in Egypt through wisdom and forgiveness.",
    body:\`Joseph was one of twelve brothers, and their father Jacob loved him dearly, giving him a beautiful coat of many colours. This made his brothers jealous and bitter. Their jealousy grew so strong that one day they threw Joseph into a pit and then sold him to traders going to Egypt as a slave.

In Egypt, Joseph faced many hardships. He was falsely accused of a crime and thrown into prison. But Joseph had a gift from God -- the ability to understand the meaning of dreams. In prison he helped others by interpreting their dreams correctly.

One night, the Pharaoh -- the king of Egypt -- had a troubling dream about seven fat cows eaten by seven thin cows, and seven healthy grain heads swallowed by seven withered ones. None of his wise men could explain it.

Joseph was brought before Pharaoh. He explained that the dream meant seven years of plenty followed by seven years of famine. Pharaoh was so impressed that he made Joseph the second most powerful man in all of Egypt, in charge of storing grain during the good years.

When the famine came, Joseph's brothers travelled to Egypt seeking food. They bowed before Joseph without recognising him. Joseph could have taken revenge. Instead, he revealed himself, wept with joy, and forgave them completely.

The lesson: Patience through suffering, integrity in difficult times, and the courage to forgive -- these are what turn a pit into a palace.\`
  },
  {
    id:4, title:"The Good Samaritan", ref:"Luke 10:25-37",
    summary:"Jesus tells a story about true neighbourly love that crosses every boundary of race and religion.",
    body:\`A man was travelling from Jerusalem to Jericho when robbers attacked him. They beat him, took everything he had, and left him lying wounded by the roadside.

A priest came walking by. He saw the injured man, but crossed to the other side of the road and walked past without stopping. Then a Levite -- a religious temple helper -- also came, looked at the man, and also walked away.

Finally, a Samaritan came along. Now, in those days, Jews and Samaritans did not like each other at all. They avoided each other and thought badly of each other. But when this Samaritan saw the wounded man, his heart was filled with compassion.

He got off his donkey. He cleaned and bandaged the man's wounds, using his own oil and wine as medicine. He put the man on his own donkey and walked beside him to the nearest inn. He paid the innkeeper to care for the man and said: "If it costs more than this, I will repay you when I return."

Jesus told this story when someone asked him: "Who is my neighbour?" After telling it, Jesus asked: "Which of the three was a neighbour to the man who was attacked?"

The answer was clear: the one who showed mercy.

The lesson: Your neighbour is anyone who needs your help -- regardless of where they come from, what they look like, or whether they are different from you.\`
  },
  {
    id:5, title:"Daniel in the Lions Den", ref:"Daniel 6",
    summary:"A faithful young man who refuses to stop praying is thrown to hungry lions and walks out unharmed the next morning.",
    body:\`Daniel was a wise and faithful man who served King Darius of Persia. He worked so well that the king planned to put him in charge of the entire kingdom. This made the other officials jealous and angry.

They watched Daniel carefully, looking for something -- any mistake, any fault they could report. But Daniel was honest in everything. They could find nothing wrong.

So they hatched a plan. They went to King Darius and flattered him into signing a law that said no one could pray to any god or person except the king for thirty days. Anyone who broke the law would be thrown into a pit of hungry lions.

Daniel heard about the law. He went home, opened his window toward Jerusalem as he always did, and prayed to God three times -- just as he had always done.

The jealous officials caught him and reported him to the king. Darius was deeply upset -- he liked Daniel -- but the law had been signed and could not be changed. Reluctantly, he ordered Daniel thrown into the lions' den.

The king could not sleep that night. At dawn he ran to the lions' den and called out: "Daniel! Has your God been able to save you?"

From inside came Daniel's calm voice: "The Lord sent his angel to shut the lions' mouths. They have not hurt me."

The lesson: Faithful courage -- doing what is right even when it is dangerous -- protects what no law or lion can take away.\`
  },
  {
    id:6, title:"The Feeding of Five Thousand", ref:"John 6:1-14",
    summary:"From one small boy's lunch, Jesus feeds an entire crowd of five thousand people with food to spare.",
    body:\`A great crowd of five thousand people had followed Jesus to a hillside to hear him teach and to see him heal the sick. By late afternoon, the disciples realised the problem: everyone was hungry and there was nowhere nearby to buy food for such a crowd.

Philip calculated that even eight months' wages would not be enough to buy food for everyone. The situation seemed impossible.

Then Andrew brought forward a small boy. "This boy has five small barley loaves and two small fish," Andrew said. Then he added honestly: "But how far will that go among so many?"

Jesus told the people to sit down on the grass. He took the five loaves and two fish, looked up to heaven, and gave thanks. Then he broke the bread and fish and gave it to the disciples to distribute.

Something impossible happened. Everyone ate -- all five thousand of them. They ate until they were completely full. When the meal was over, the disciples collected the leftovers: twelve baskets full of broken pieces, far more than what they had started with.

The boy had given everything he had, even though it seemed too small to matter.

The lesson: When we give what we have -- however little it seems -- and place it in generous and grateful hands, it becomes more than enough for everyone.\`
  },
]

export default function BibleStories() {
  const [search, setSearch] = useState('')

  const filtered = STORIES.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.summary.toLowerCase().includes(search.toLowerCase())
  )

  const card = { background:'#111827', border:'1px solid #1f2937', borderRadius:'14px', padding:'20px', marginBottom:'12px' }

  return (
    <div>
      <div style={{ marginBottom:'24px' }}>
        <h1 style={{ fontSize:'1.7rem', fontWeight:800, color:'#f9fafb', margin:'0 0 4px' }}>Bible Stories</h1>
        <p style={{ fontSize:'.875rem', color:'#6b7280', margin:0 }}>Classic stories of faith, courage and wisdom</p>
      </div>
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search stories..."
        style={{ width:'100%', background:'#111827', border:'1.5px solid #1f2937', borderRadius:'12px', padding:'12px 16px', color:'#f9fafb', fontSize:'.9rem', outline:'none', marginBottom:'20px', boxSizing:'border-box' }}
      />
      {filtered.map(s => (
        <div key={s.id} style={card}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
            <p style={{ fontWeight:700, color:'#f9fafb', margin:0, fontSize:'.95rem' }}>{s.title}</p>
            <span style={{ fontSize:'.7rem', color:'#818cf8', fontWeight:600, background:'rgba(99,102,241,0.1)', padding:'2px 8px', borderRadius:'20px', flexShrink:0 }}>{s.ref}</span>
          </div>
          <p style={{ color:'#9ca3af', fontSize:'.82rem', margin:'0 0 16px', lineHeight:1.5, fontStyle:'italic' }}>{s.summary}</p>
          <div style={{ color:'#d1d5db', fontSize:'.9rem', lineHeight:1.85 }}>
            {s.body.split('\\n\\n').map((p, i) => (
              <p key={i} style={{ marginBottom:'14px' }}>{p}</p>
            ))}
          </div>
        </div>
      ))}
      {filtered.length === 0 && (
        <div style={{ textAlign:'center', padding:'48px', color:'#6b7280' }}>
          <p style={{ fontWeight:600, margin:0 }}>No stories found</p>
        </div>
      )}
    </div>
  )
}
`

fs.writeFileSync(filePath, content, 'utf8')
console.log('✅ Written: ' + filePath)
console.log('🎉 Done! Original layout restored, broken characters removed.')
