-- Kids Stories Seed Data
-- 20 original stories across age groups 3-5, 5-8, 8-12
-- Generated: June 2026

-- Ensure Kids category exists
INSERT INTO categories (name, description) VALUES
('Kids', 'Children''s books - age-appropriate stories')
ON CONFLICT DO NOTHING;

INSERT INTO books (title, author, category, difficulty, age_group, description, content, total_pages, rating, cover_image_url) VALUES

-- ==========================================
-- AGE 3-5 (A1) - Simple sentences, basic vocabulary
-- ==========================================

(
  'Bramble the Brave Bunny',
  'Lily Brooks',
  'Kids',
  'A1',
  '3-5',
  'A little bunny learns that being brave means facing your fears, even in the dark.',
  'Bramble was a little bunny with soft brown fur and the longest ears in the meadow. He loved to hop through the clover patch and nibble sweet carrots until his tummy was full. But when the sun went down, Bramble was scared of the dark. The shadows looked like big monsters, and the nighttime sounds made him shiver.

One evening, Bramble realized he had left his favorite sparkly carrot near the old oak tree. It was almost dark outside, but that carrot was very special. It was the carrot he had saved for three whole days. Bramble took a deep breath and stepped out of his burrow.

The moon was round and bright, and the path was not as scary as he thought. A tiny glow-worm named Gilly saw him shaking and came to help. "I will light your way," said Gilly in her tiny voice. Together they hopped past the bushes and under the big leaves. When Bramble found his sparkly carrot, he was so happy! He thanked Gilly and hopped home.

That night, Bramble learned that the dark is not so scary after all. Sometimes you just need a little friend to help you see the light. And the next morning, he told all his bunny friends about his brave adventure.',
  28,
  4.8,
  'https://placehold.co/400x600/F8B4C8/FFFFFF?text=Bramble+the+Brave+Bunny'
),

(
  'The Little Cloud Who Wanted to Rain',
  'Lily Brooks',
  'Kids',
  'A1',
  '3-5',
  'A small cloud discovers that everyone has their own special way to shine.',
  'High up in the bright blue sky lived a little cloud named Coco. She was small and fluffy and very white. Every day she watched the big clouds make rain. They went grumble-grumble and then splash-splash all over the ground. The rain made the flowers grow and the rivers fill up. Coco wanted to make rain too.

But every time Coco tried to go grumble-grumble, only a tiny puff of air came out. "You are too small," said the big clouds. "Little clouds cannot make rain." Coco felt very sad. She floated away from the other clouds all by herself.

She drifted over a dry, dusty field where a little flower was wilting. "I am so thirsty," whispered the flower. Coco wanted to help. She tried so hard. She squeezed herself tight and puffed out her chest. And then something wonderful happened!

A tiny drop of rain fell down. Then another drop. And another! Plink, plink, plink went the drops on the little flower. The flower lifted its head and smiled. Coco did not make a big storm, but she made exactly the right amount of rain for one little flower.

Coco learned that being small is okay. Even a tiny cloud can make a big difference to someone who needs help.',
  24,
  4.9,
  'https://placehold.co/400x600/87CEEB/FFFFFF?text=The+Little+Cloud'
),

(
  'Pip''s Big Surprise',
  'Sam Rivers',
  'Kids',
  'A1',
  '3-5',
  'A puppy discovers that the best surprises come from helping others.',
  'Pip was a small puppy with floppy ears and a tail that never stopped wagging. He lived in a red house with a big garden. Pip loved to dig holes and chase butterflies all day long.

One morning, Pip found a shiny golden key under the rose bush. "I wonder what this opens," he thought. He sniffed the key and carried it carefully in his mouth. He tried the key on the garden gate, but it did not fit. He tried it on the shed door, but it did not fit either.

Pip walked to the park and saw his friend Bella the cat looking very sad. "What is wrong, Bella?" asked Pip. Bella had lost her special necklace with a tiny silver bell on it. She loved that bell because it went jingle-jingle when she walked.

Pip remembered the key and had an idea. He ran back to the garden and looked near the rose bush. There, under a big leaf, was a little box. Pip put the key in the lock and turned it. Click! The box opened, and inside was Bella''s silver bell necklace!

Bella was so happy that she purred and rubbed against Pip''s legs. "You are the best friend ever," she said. Pip felt warm and happy inside. He learned that the best surprises are the ones you share with your friends.',
  32,
  4.7,
  'https://placehold.co/400x600/FEBC3B/FFFFFF?text=Pip+Big+Surprise'
),

(
  'The Quiet Little Star',
  'Nora Chen',
  'Kids',
  'A1',
  '3-5',
  'A tiny star learns that even the smallest light can guide someone home.',
  'Every night, the sky filled with stars. Big stars twinkled brightly. Medium stars sparkled cheerfully. And very small stars flickered quietly. One of those tiny stars was named Stella. She was so small that people on Earth could barely see her.

Stella wanted to be big and bright like the other stars. "Shine harder," said the big stars. Stella tried her very best. She flickered and flashed, but she was still small. She felt like she was not important.

Down on Earth, a little boy named Theo was lost in the woods. He was scared and looked up at the sky for help. The big stars were beautiful, but they were all the way up high. Theo saw a tiny flickering light that seemed to move toward him.

It was Stella! She was not very bright, but she was close. She twinkled right above the path that led back home. Theo followed her little light through the trees. Step by step, Stella guided him until he saw his house lights.

"Thank you, little star," Theo whispered before going inside. Stella felt warm and proud. She did not need to be the biggest star. She was exactly the right star for the little boy who needed her.',
  24,
  4.8,
  'https://placehold.co/400x600/FFD700/FFFFFF?text=The+Quiet+Little+Star'
),

(
  'Bella and the Honey Tree',
  'Max Turner',
  'Kids',
  'A1',
  '3-5',
  'A bear cub learns that sharing makes everything taste sweeter.',
  'Bella was a fluffy bear cub who loved honey more than anything in the world. She loved honey on her pancakes, honey on her berries, and honey straight from the jar. One day, she found a big tree with a bee hive full of golden honey.

Bella climbed up the tree and dipped her paw into the hive. The honey was so sweet and sticky! She ate and ate until her tummy was round and full. But when she looked down, she saw her friends watching. Ollie the otter, Pip the rabbit, and Daisy the deer were all standing at the bottom of the tree.

"Can we have some honey too?" asked Ollie. Bella looked at the hive. There was still plenty of honey. She thought about keeping it all for herself, but then she looked at her friends'' hopeful faces.

Bella filled a big leaf with honey and lowered it down to her friends. They all tasted the sweet honey and smiled. "This is the best honey ever!" said Daisy. They all sat together under the tree, sharing the honey and laughing.

Bella learned that honey tastes even sweeter when you share it with your friends. She promised to always share her honey tree with everyone.',
  28,
  4.9,
  'https://placehold.co/400x600/D4A373/FFFFFF?text=Bella+and+the+Honey+Tree'
),

(
  'The Lost Sock Adventure',
  'Zoe Patel',
  'Kids',
  'A1',
  '3-5',
  'A missing sock leads to a surprising discovery in the laundry room.',
  'Mommy was doing laundry. Socks went in the washing machine whoosh-whoosh, and socks came out clean. But one sock did not come out. It was a blue sock with yellow stars on it. Lily loved that sock very much.

"Where is my star sock?" Lily asked. She looked in the laundry basket. She looked under her bed. She looked in the toy box. No star sock anywhere.

Then Lily heard a tiny sound. Squeak-squeak-squeak. It was coming from behind the washing machine. Lily peeked behind it and saw a little mouse. The mouse was wearing her star sock as a sleeping bag!

"Hello," said Lily. "That is my sock." The mouse looked up with big shiny eyes. "I am sorry," said the mouse. "It is so soft and warm. I could not find a blanket for my babies."

Lily looked behind the machine and saw three tiny baby mice sleeping on a cotton ball. They were shivering a little bit. Lily smiled. "You can keep the sock until your babies are bigger," she said.

The mouse was so happy she gave Lily a tiny button as a thank-you gift. Lily wore the button on her coat and told everyone about her new mouse friends.',
  26,
  4.7,
  'https://placehold.co/400x600/6B8E23/FFFFFF?text=The+Lost+Sock'
),

(
  'Sunny the Snail Goes Fast',
  'James Kim',
  'Kids',
  'A1',
  '3-5',
  'A slow snail discovers that everyone moves at their own perfect pace.',
  'Sunny was a little snail with a swirly shell that sparkled in the sun. All the other garden animals were fast. The ants marched quickly. The beetles zoomed by. The butterflies flew here and there. But Sunny was very, very slow.

"Come on, Sunny!" called the ants. "You are so slow!" Sunny tried to go faster. He wiggled and jiggled and slid as fast as he could, but he was still slow. This made Sunny very sad.

One day, a big rainstorm came to the garden. The fast animals all ran to find shelter. The ants ran to their hill. The beetles hid under rocks. The butterflies flew to the flowers. But the rain was too fast, and many of them got wet.

Sunny simply pulled his body into his shell and closed the door. His shell was his own little house. He was safe and dry and warm inside. The rain bounced off his shell like tiny drums.

When the rain stopped, the animals came out shivering. "You are so lucky, Sunny," said the ants. "Your shell is a house you can carry everywhere." Sunny smiled. He might be slow, but he was always safe and cozy. He learned that being slow is not a problem. Everyone moves at their own pace, and that is perfectly fine.',
  26,
  4.8,
  'https://placehold.co/400x600/98D8C8/FFFFFF?text=Sunny+the+Snail'
),

-- ==========================================
-- AGE 5-8 (A1-A2) - Richer sentences, simple plots
-- ==========================================

(
  'The Forest Friends'' Treasure Map',
  'Lily Brooks',
  'Kids',
  'A2',
  '5-8',
  'Four animal friends follow a mysterious treasure map and find something more valuable than gold.',
  'One sunny morning, Pip the rabbit found a crinkly brown paper tucked under a mushroom. It was a treasure map! There was a red X right in the middle of Whispering Woods. Pip''s ears perked up with excitement. He hopped quickly to find his friends.

He found Ollie the otter splashing in the stream. "Look what I found!" said Pip. Ollie climbed out of the water and looked at the map. "We need to follow the Yellow Stone Path past the Big Rock and then turn left at the Three Tall Trees." Ollie loved adventures, so he shook the water off his fur and joined Pip.

Next they found Daisy the deer nibbling flowers in the meadow. "A treasure hunt?" she asked with a gentle smile. "I know the way to the Big Rock. Follow me!" Daisy led them through the tall grass, her hooves making soft tapping sounds on the ground.

At the Big Rock, they met Finn the squirrel who was busy hiding acorns. "The Three Tall Trees are just across the little bridge," Finn said. "I will come with you. I am good at spotting things from up high." Finn climbed onto Pip''s shoulder and pointed the way.

The four friends crossed the bridge and found the Three Tall Trees. Under the biggest tree, there was a tiny wooden box. They opened it carefully. Inside was not gold or jewels. Inside was a collection of beautiful painted stones, each one with a picture of a different forest animal.

They also found a note: "These stones were painted by all the animals who lived here before you. Now it is your turn to add your own. The real treasure is friendship and the memories you make together."

The friends spent the rest of the afternoon painting their own stones and adding them to the box. They buried the box again for the next group of friends to find.',
  48,
  4.7,
  'https://placehold.co/400x600/2ECC71/FFFFFF?text=Forest+Friends+Map'
),

(
  'Ollie the Owl''s Nighttime Secret',
  'Sam Rivers',
  'Kids',
  'A1',
  '5-8',
  'A young owl discovers the magic of the night and makes an unexpected friend.',
  'Ollie was a young owl who lived in a hollow tree at the edge of the forest. While all the other animals slept, Ollie stayed awake. Being a night owl was his job. Every evening, he opened his big yellow eyes and watched the world change.

From his high branch, Ollie saw wonderful things. He saw the moon rise like a giant pearl over the hills. He saw fireflies dancing in the meadow like tiny floating lanterns. He heard the gentle whisper of the wind through the leaves. The night was full of magic that daytime creatures never saw.

One night, Ollie heard a soft crying sound. He flew down to find a little hedgehog sitting by a rock. "What is wrong?" asked Ollie. "I am lost," said the hedgehog. "I woke up from my nap and I cannot find my family. Everything looks different in the dark."

Ollie remembered how the map of stars helped him find his way home. "Look up," he said to the hedgehog. "See that group of bright stars that looks like a cup? That is the Big Dipper. It always points north. Your family lives near the old stone wall, which is north of here."

The hedgehog looked up and saw the stars. "You can read the stars?" she asked. "The sky is my map," said Ollie proudly. "Every night it shows me where I am."

Ollie flew slowly above the hedgehog, guiding her through the forest. They passed the sleeping rabbits and the quiet stream. Finally, they reached the old stone wall, where the hedgehog''s family was waiting.

"Thank you, Ollie," said the hedgehog. "I was so scared, but you made the night feel friendly."

After that, Ollie and the hedgehog became best friends. Every night, the hedgehog would visit Ollie''s tree, and Ollie would teach her the secrets of the night sky.',
  40,
  4.8,
  'https://placehold.co/400x600/8E44AD/FFFFFF?text=Ollie+the+Owl'
),

(
  'The Magical Paintbrush',
  'Nora Chen',
  'Kids',
  'A2',
  '5-8',
  'A little girl discovers a paintbrush that brings her drawings to life and learns to use her imagination wisely.',
  'Maya loved to draw more than anything. She drew flowers, butterflies, castles, and dragons. Her room was covered in drawings from floor to ceiling. One rainy afternoon, she found a strange paintbrush tucked behind her bookshelf. It was made of smooth silver wood with a soft golden tip.

Maya dipped the brush in water and painted a blue butterfly on her wall. To her amazement, the butterfly fluttered its wings and flew off the wall! It circled around her head and landed on her finger. Maya gasped. This was no ordinary paintbrush.

She painted a tiny orange cat. The cat jumped down from the wall and began purring and rubbing against her legs. Maya laughed with delight. She painted a slice of chocolate cake, and it appeared on her desk, warm and smelling delicious.

Maya wanted to show her mother, but then she thought carefully. What if she painted something by accident that could cause trouble? She decided to be very careful. She painted a beautiful flower garden on her wall, and it grew and bloomed, filling her room with the sweet smell of roses and lavender.

Her mother came in and gasped. "Maya, how did you do this?" she asked. Maya showed her the magic paintbrush. Her mother smiled. "With great power comes great responsibility," she said. "Use this gift to make the world more beautiful, not just for yourself."

Maya nodded. She spent the rest of the week painting wonderful things. She painted a rainbow bridge for the birds. She painted cozy little houses for the stray cats. She painted a mural of the night sky on the ceiling of her little brother''s room so he would not be scared of the dark.

Maya learned that the real magic was not in the paintbrush at all. It was in her imagination and her kind heart. The paintbrush just helped her share it with the world.',
  52,
  4.9,
  'https://placehold.co/400x600/E74C3C/FFFFFF?text=Magical+Paintbrush'
),

(
  'Captain Whiskers and the Pirate Parrot',
  'Max Turner',
  'Kids',
  'A1',
  '5-8',
  'A brave cat and a talking parrot sail the bathtub sea in search of the Golden Fishbone.',
  'Captain Whiskers was a fluffy ginger cat with a pirate hat made of folded paper. Every night after his bath, he sailed his yellow rubber boat across the big blue bathtub sea. His first mate was a toy parrot named Percy who sat on the edge of the boat and said "Squawk!" whenever Captain Whiskers needed important advice.

"There is a treasure map in the soap dish," said Captain Whiskers. "It shows the way to the legendary Golden Fishbone!" Percy squawked loudly. The Golden Fishbone was the most wonderful treasure any cat could dream of.

The bathtub sea was full of dangers. There were slippery seaweed socks and giant bubble monsters. Captain Whiskers paddled bravely through the bubbles. When a big wave of water came, he held on tight to Percy and steered the boat with a toothbrush paddle.

Suddenly, a huge rubber duck appeared. "HALT!" boomed the duck. "No one passes through Bubble Bay without answering a riddle!" Captain Whiskers was not afraid of riddles. "What has a face and two hands but no arms or legs?" asked the duck.

Captain Whiskers thought hard. "A clock!" he shouted. The rubber duck was impressed and let them pass.

Finally, they reached the island made of a sponge. Buried in the sponge was the Golden Fishbone. It sparkled and shone like real gold. Captain Whiskers was so happy. He brought the treasure back to his pirate crew and shared it with all his toy friends.

"Squawk! Best adventure ever!" said Percy. Captain Whiskers saluted the rubber duck and sailed back to shore, ready for his next great adventure.',
  44,
  4.7,
  'https://placehold.co/400x600/F39C12/FFFFFF?text=Captain+Whiskers'
),

(
  'The Garden That Grew Dreams',
  'Zoe Patel',
  'Kids',
  'A2',
  '5-8',
  'A little girl plants magical seeds that grow into the dreams of her neighbors.',
  'Leela lived in a tall apartment building in the middle of a busy city. There was no garden anywhere. Leela missed the green fields she remembered from her grandmother''s village. One day, a package arrived. Inside was a small envelope with seeds and a note: "These are dream seeds. Plant them and watch what grows."

Leela did not have any dirt, so she used an old flowerpot and some soil from the plant in the hallway. She planted the tiny silver seeds and watered them every morning. On the third day, a strange plant with rainbow-colored leaves sprouted.

The first flower bloomed at night. It glowed with a soft golden light. Inside the flower, Leela saw a picture. It was her neighbor Mr. Gomez, who was always grumpy, smiling and playing a guitar on a stage full of people.

The next morning, Leela told Mr. Gomez about what she saw. Mr. Gomez looked surprised. "I used to play guitar when I was young," he said quietly. "I always dreamed of being a musician." Leela smiled. "Maybe you should play again," she said.

That afternoon, Mr. Gomez took out his old guitar from the closet. He played a beautiful song, and all the neighbors came out to listen. He was not grumpy anymore.

More flowers bloomed. One showed Mrs. Chen wanting to open a bakery. Another showed the boy upstairs wanting to be an astronaut. Leela told each person about their flower. One by one, the neighbors started chasing their dreams.

Mr. Gomez started a small music class. Mrs. Chen baked cookies for the whole building. The boy upstairs built a model rocket with his father. The garden grew and grew, filling the apartment with hope and happiness.

Leela learned that sometimes people just need someone to believe in their dreams. And a little bit of magic can help remind them.',
  56,
  4.8,
  'https://placehold.co/400x600/9B59B6/FFFFFF?text=Garden+of+Dreams'
),

(
  'Finn the Little Fish Who Wanted to Fly',
  'James Kim',
  'Kids',
  'A1',
  '5-8',
  'A little fish dreams of flying above the water and discovers that being happy with who you are is the best gift.',
  'Finn was a tiny orange fish with shiny silver scales. He lived in a beautiful coral reef with his family and friends. Every day, he watched the seabirds soar through the sky. They flew so high and so free. Finn wished he could fly too.

"I want to fly like the birds," Finn told his mother. "But you are a fish," she said gently. "Fish swim. Birds fly. That is how the world works."

Finn did not give up. He tried jumping out of the water. Splash! He went up for one second and then fell back down. He tried flapping his fins like wings. Nothing happened. He asked the wise old turtle for advice. "Be patient," said the turtle. "You will find your own way to fly."

One day, a big storm came to the reef. The waves were huge, and the current was very strong. Finn''s little sister, Coral, got swept away by the current. Finn did not think twice. He swam faster than he had ever swum before.

He zoomed through the water, dodging rocks and seaweed. He found Coral clinging to a piece of driftwood. "Hold on!" Finn shouted. He pushed the driftwood with all his might toward the reef.

But there was a giant wave coming right at them. Finn remembered the flying fish he had seen once. He swam as fast as he could toward the surface and burst out of the water. He soared through the air, right over the wave, and landed safely on the other side with Coral.

"You did it! You flew!" cheered Coral. Finn realized that he did not need to be a bird. He was already amazing just being a fish. He could swim fast, jump high, and save the day.

"Flying is fun," Finn said, "but swimming is pretty great too." He spent the rest of the day showing Coral how to do tricks in the water.',
  44,
  4.7,
  'https://placehold.co/400x600/3498DB/FFFFFF?text=Finn+the+Little+Fish'
),

(
  'The Star-Catching Blanket',
  'Lily Brooks',
  'Kids',
  'A2',
  '5-8',
  'A little girl''s grandmother gives her a special blanket that can catch falling stars and grant wishes.',
  'Lily loved visiting her grandmother''s cottage in the countryside. Grandma had a cozy house full of warm blankets, soft pillows, and cookies that smelled like cinnamon. But the most special thing in the cottage was the star-catching blanket.

It was a patchwork quilt made of blue silk and silver thread. Grandma said she had sewn it herself when she was a young girl. "This blanket can catch falling stars," she told Lily. "If you spread it out on a clear night and make a wish, the stars will listen."

Lily thought it was just a story, but she loved the blanket anyway because it smelled like Grandma''s lavender soap. One clear summer night, Lily took the blanket to the garden and spread it on the grass. She lay down and looked at the stars twinkling above her.

"Please let me have a wonderful adventure," she whispered.

A streak of light crossed the sky. A falling star! It landed right on the blanket with a soft shimmer. The star was warm and golden, no bigger than a marble. Lily picked it up carefully. It hummed with a gentle energy.

Suddenly, the garden around her began to glow. The flowers grew taller, their colors brighter. The fireflies formed a dancing spiral in the air. A tiny door appeared at the base of the old oak tree, and out came a little person no bigger than Lily''s hand.

"Thank you for catching our star," said the little person. "I am Willow, a garden sprite. The star keeps our garden alive. Every hundred years, it falls, and we need someone kind to catch it and wish for the garden to bloom."

Lily looked at the star in her hand. "I wish for this garden to be full of life and magic forever," she said. The star glowed brightly and floated up into the sky, where it settled back into its place among the constellations.

The garden bloomed with flowers of every color. Trees grew ripe fruit. The air filled with sweet music. Willow smiled and gave Lily a tiny flower that would never wilt.

"You will always be welcome here," Willow said, and disappeared back through the tiny door.

Every summer after that, Lily visited Grandma and spread the blanket in the garden. Sometimes she saw tiny lights dancing among the flowers. And she knew the magic was real.',
  64,
  4.9,
  'https://placehold.co/400x600/1ABC9C/FFFFFF?text=Star-Catching+Blanket'
),

-- ==========================================
-- AGE 8-12 (A2-B1) - Complex plots, richer vocabulary
-- ==========================================

(
  'The Whispering Waterfall',
  'Sam Rivers',
  'Kids',
  'B1',
  '8-12',
  'Two siblings discover a hidden waterfall that carries the voices of the past and must solve an ancient riddle to save their village.',
  'Leo and his younger sister Maya spent every summer at their grandmother''s cottage near the Misty Mountains. The cottage had creaky floors and a fireplace that crackled with warmth, but the best part of summer was exploring the forest behind the house.

One afternoon, they ventured deeper than ever before. They pushed through thick ferns and climbed over mossy logs until they heard a sound they had never heard. It was not the usual birdsong or rustling leaves. It was a whisper, soft and melodic, coming from somewhere ahead.

They followed the sound and found a waterfall hidden behind a curtain of hanging vines. The water fell in shimmering curtains of silver and blue, and the pool below was crystal clear. But the most amazing thing was the whispering. The water seemed to speak.

"Help us," the water seemed to say. "The bridge is broken. The path is lost."

Leo and Maya looked at each other. "Did you hear that?" Maya asked. Leo nodded slowly. They looked around and saw the remains of an old stone bridge that once crossed the stream. It was broken in the middle, covered in moss and vines.

Grandma had told them stories about an old village that used to be in these mountains. A terrible storm had washed away the bridge, cutting the village off from the rest of the world. The people had to leave their homes. But legend said the village''s spirit still lived in the waterfall.

"We need to fix the bridge," Leo said. Maya looked doubtful. "We are just kids. How can we rebuild a bridge?" Leo pointed to the stones scattered around. "One stone at a time."

For three days, they carried stones from the forest to the stream. They stacked them carefully, using flat rocks for the top and smaller ones to fill the gaps. The waterfall whispered encouragement. On the fourth day, a old woman appeared on the other side of the stream.

"You are the bridge builders," she said with a smile. "I have been waiting a long time." She crossed the new bridge carefully and handed Leo a small metal box. "This contains the history of our village. Now that the bridge is rebuilt, our stories can cross over to the future."

Leo opened the box and found old photographs, letters, and a journal. The people of the village smiled from the faded pictures. "We will take this to the museum in town," Maya promised.

That evening, the waterfall seemed to sing a joyful song. The whispers were gone, replaced by a peaceful melody. Grandma was amazed when they showed her the box. "No one has crossed that bridge in eighty years," she whispered.

Leo and Maya realized that sometimes the most important adventures are the ones that connect the past to the future. And a simple act of kindness can restore something beautiful.',
  96,
  4.7,
  'https://placehold.co/400x600/2980B9/FFFFFF?text=Whispering+Waterfall'
),

(
  'The Cartographer''s Apprentice',
  'Nora Chen',
  'Kids',
  'A2',
  '8-12',
  'A young girl apprenticed to a mapmaker discovers a hidden island that appears only once every hundred years.',
  'Elena lived in a port town where ships came and went every day. Her father was a cartographer, a mapmaker, who spent his days drawing coastlines and marking harbors on parchment. Elena loved watching him work, dipping his quill in ink and drawing careful lines.

"Papa, teach me to make maps," she begged. Her father smiled and handed her a blank piece of parchment. "Every map starts with a blank page and an adventure," he said. "Draw what you see."

Elena started mapping their town. She drew the lighthouse, the market square, the winding streets, and the docks. She added details like the baker''s blue door and the fountain with the dolphin statue. Her father was impressed.

Then Elena found an old map in her father''s study. It was yellowed and torn, but she could make out an island in the shape of a crescent moon. "Papa, what island is this?" she asked. Her father looked serious. "That is Lumina Island. It appears only once every hundred years, when the stars align. No one has ever mapped its shores."

Elena decided she would be the one to map Lumina Island. She studied the stars with an old telescope in the attic. She read books about tides and currents. She prepared a blank journal with a hard cover to protect it from sea spray.

The night of the alignment came. Elena took a small rowboat and pushed off into the dark water. The stars seemed brighter than ever. She rowed for what felt like hours. Then, through the mist, she saw a glow. It was Lumina Island, rising from the sea like a sleeping giant.

The island was covered in phosphorescent plants that glowed in shades of blue and green. Strange birds with silver feathers flew overhead. Elena walked along the shore, drawing everything she saw. She discovered a cove with water as clear as glass, a forest of glowing mushrooms, and a hill that hummed with a quiet song.

On the hill, she found a crystal embedded in the ground. When she touched it, the island began to tremble. It was time to leave. She raced back to her boat, her journal safely tucked under her arm.

As she rowed away, the island sank back into the mist. By morning, it was gone. But Elena had her maps. She showed them to her father, who looked at them with wonder.

"You have done what no cartographer has ever done," he said proudly. "You mapped Lumina Island."

Elena''s maps were framed and hung in the town museum. She became the most famous cartographer in the region. But she never told anyone about the crystal, which she kept safely in her pocket, waiting for the next alignment a hundred years later.',
  88,
  4.8,
  'https://placehold.co/400x600/16A085/FFFFFF?text=Cartographer+Apprentice'
),

(
  'The Last Seed of the Golden Forest',
  'Max Turner',
  'Kids',
  'B1',
  '8-12',
  'A boy races against time to plant the last remaining seed from a magical forest before its magic fades forever.',
  'Kai lived at the edge of what was once called the Golden Forest. The trees had shimmering leaves like coins, and the air smelled of honey and sunshine. But the forest was dying. Year by year, the golden trees turned gray and crumbled to dust.

Kai''s grandmother was the guardian of the forest. She had a small leather pouch with one single seed inside. It was the last seed of the Golden Forest. "This seed holds all the magic that is left," she told Kai. "It must be planted in the right place, at the right time, or the magic will be lost forever."

The problem was that the Golden Forest had become the Gray Wasteland. Nothing grew there anymore. The soil was dry and dead. Grandmother was too weak to travel, so she entrusted the seed to Kai.

"You have three days," she said. "The seed must touch living soil before the third moonrise, or its magic will fade."

Kai packed a small bag with water, bread, and the precious seed pouch. He set off at dawn. His first stop was the old village, but the soil there was hard as stone. He dug with his hands until his fingers bled, but nothing could break the ground.

He met a girl named Rika who was herding goats. "The forest died because people stopped caring," she said. "They cut trees for wood and never planted new ones. The soil needs love, not just water."

They traveled together to the river valley, where the soil was soft and dark. Kai dug a small hole and held the seed over it. But the seed did not glow. It lay cold and still in his palm. "The soil is good here," Rika said, "but maybe the seed needs something else."

Kai thought about what his grandmother had said. The seed held the forest''s memories. Maybe it needed to feel like home. Kai poured some of his water onto the ground and mixed it with soil from the forest''s edge. He added a handful of golden leaves he had kept from when he was little.

When he placed the seed in the hole this time, it began to glow. A warm golden light spread from the seed through the soil. Tiny green shoots appeared, growing quickly. In moments, a sapling stood where the seed had been. Its leaves were pure gold.

The sapling grew into a tree, then the tree released seeds that floated on the wind. Everywhere the seeds landed, new golden trees sprouted. Within hours, the Golden Forest was reborn.

Kai and Rika stood in the middle of a forest that shimmered like morning sunlight. "You did it," Rika whispered. Kai shook his head. "We did it. The forest needed more than a seed. It needed belief."

Grandmother was waiting at the edge of the forest when they returned. She was standing, no longer weak, with tears in her eyes. "The forest is alive again," she said. "You have given us all a future."',
  120,
  4.9,
  'https://placehold.co/400x600/F1C40F/333333?text=Last+Seed+Golden+Forest'
),

(
  'The Clockmaker''s Secret',
  'Zoe Patel',
  'Kids',
  'A2',
  '8-12',
  'A curious boy discovers that his grandfather''s antique clock contains a secret mechanism that can pause time for exactly one hour.',
  'Oliver''s grandfather was a clockmaker. His workshop was full of ticking clocks, swinging pendulums, and tiny gears spread across every surface. The air smelled of oil and brass and old wood. Oliver loved visiting Grandpa''s workshop more than anywhere else in the world.

Among all the clocks, one stood out. It was a grandfather clock made of dark cherry wood with carvings of moons and stars. It had stood in the same corner for fifty years. "That clock is special," Grandpa always said, but he never said why.

On Oliver''s twelfth birthday, Grandpa finally showed him the secret. He opened the back panel of the clock and revealed a complex mechanism of golden gears and tiny crystals. "This is the Pause," Grandpa explained. "It can stop time for exactly one hour. But it can only be used once every hundred years."

Oliver stared in wonder. "Have you ever used it?" he asked. Grandpa laughed. "My father used it once. He spent the frozen hour planting a garden for my mother. She never knew how all those flowers appeared overnight."

Grandpa showed Oliver the special key that wound the mechanism. "It is your turn now, Oliver. Use it wisely. One hour of frozen time. You can do anything, but no one will remember it except you."

Oliver took the key home. He thought about what to do with his hour. He could play endless video games. He could eat all the candy in the store. He could spy on his classmates. But none of those felt right.

Then he saw his mother in the kitchen, exhausted from working double shifts. She never had time to rest. Oliver made his decision.

That evening, as his mother was about to start the dishes, Oliver wound the key. The world went silent. The clock on the wall stopped ticking. The birds outside froze mid-flight. Oliver stood in a world without time.

He spent his hour cleaning the entire house. He washed the dishes, swept the floors, folded the laundry, and made dinner. He set the table with the good plates and arranged flowers in a vase. Then he sat down and waited.

Time resumed. His mother walked into the kitchen and stopped. "Oliver," she whispered, "how did you do all this?" Oliver just smiled. "I wanted to help, Mom."

His mother hugged him tightly. "This is the best birthday surprise ever," she said, wiping her eyes.

Oliver never told her about the clock. But that night, he wrote in his journal: "Time is the most precious gift we have. I used my hour to give my mother the gift of rest. I think Grandpa would be proud."

He returned the key to the clock, knowing it would be another hundred years before anyone could use it again. But the lesson would stay with him forever.',
  104,
  4.8,
  'https://placehold.co/400x600/2C3E50/FFFFFF?text=Clockmaker+Secret'
),

(
  'Melody of the Moon Flute',
  'James Kim',
  'Kids',
  'B1',
  '8-12',
  'A young musician discovers an ancient flute that can make the moon sing, and must perform at the harvest festival to save her village''s traditions.',
  'Mei lived in a small village nestled between rice terraces and bamboo forests. Every evening, the old women sang songs passed down through generations, and the farmers played drums made of animal skin. Music was the heartbeat of the village.

But the young people were leaving for the city. They said the old music was boring and old-fashioned. They wanted modern songs and bright lights. Mei loved her village''s music. She played the bamboo flute, though not very well yet. Her notes came out shaky and uncertain.

One day, while clearing her grandmother''s attic, Mei found a flute made of pale silver wood. It was carved with crescent moons and stars that seemed to shimmer. "What is this?" she asked her grandmother. Grandmother''s eyes went wide.

"That is the Moon Flute," she whispered. "It has not been played in seventy years. Legend says it can call the moon to sing. But only someone with a pure heart can play it."

Mei brought the flute to her lips and blew a soft note. The note floated up like a breeze, and the sky outside the window darkened. The sun set early, and the moon rose, full and brilliant. A beam of moonlight touched the flute, and it began to glow.

The village gathered outside, amazed. The moon was singing a melody, and Mei was playing along without even trying. Her fingers moved across the holes of the flute, producing notes she had never learned. The music spoke of ancient rice harvests, of love and loss, of the mountains and the rivers.

When the song ended, the villagers were silent. Then they cheered. The oldest woman in the village, Granny Lin, came forward with tears in her eyes. "I heard that song once before, when I was a girl," she said. "It is the Harvest Anthem. It has not been played properly in my lifetime."

The village decided to hold a Harvest Festival, the biggest one in decades. Mei was asked to perform the Moon Flute song. She practiced every day, but the flute would not glow for her anymore. The magic came only when she truly believed in what she was playing.

On the night of the festival, the entire village gathered in the square. Lanterns floated in the air. Tables were filled with rice cakes and sweet dumplings. Mei stood on the stage, nervous. What if the flute did not work?

She closed her eyes and thought about her grandmother, about the stories, about the mountains and the rivers. She put the flute to her lips and played from her heart. The moon rose and cast its light on her. The flute glowed.

Music poured out, filling the valley with a sound that was both ancient and new. The villagers joined in with drums and voices. The young people who had planned to leave the village looked at each other. Maybe the old traditions were worth keeping after all.

After the festival, a group of young people decided to stay and form a band, playing both traditional instruments and modern ones. Mei became their flutist. The Moon Flute had brought the village together again.',
  112,
  4.9,
  'https://placehold.co/400x600/8E44AD/FFFFFF?text=Melody+Moon+Flute'
),

(
  'The Sky Garden',
  'Lily Brooks',
  'Kids',
  'A2',
  '8-12',
  'Four children from different backgrounds build a rooftop garden together and discover that friendship grows in the most unexpected places.',
  'The Skyline Apartments were tall, gray, and boring. Twelve floors of identical windows and concrete walls. There was no playground, no park, no green space anywhere. The children who lived there played in the parking lot or the narrow hallway.

Four of them met on the rooftop one summer day. There was Amir, who loved science and carried a magnifying glass everywhere. There was Sofia, whose grandmother had a garden in the countryside and who knew the names of every flower. There was Chen, who had just moved from another country and did not speak much English yet. And there was Maya, who was always looking for an adventure.

"Why is the roof so empty?" asked Maya. "We could do something with all this space."

Amir looked at the flat concrete surface and had an idea. "A garden," he said. "We could build a garden up here." Sofia''s eyes lit up. "My grandmother sends me seeds from her garden. I have sunflower seeds, tomato seeds, and pumpkin seeds!"

Chen pointed at himself and said, "I help." He mimed digging and watering.

The four children started the Sky Garden project. They collected old buckets, plastic bottles, and wooden crates from the recycling bins. Sofia showed them how to make holes in the bottoms for drainage. Amir calculated how much sunlight each spot got during the day. Chen carried soil up the stairs in bags, twelve floors, trip after trip. Maya drew a map of where everything would go.

The building manager, Mr. Henderson, was not happy. "No gardening on the roof," he said firmly. "It is against the rules." The children were discouraged, but they did not give up. They wrote a letter explaining their plan, how the garden would make the building beautiful and bring the community together.

Mr. Henderson read the letter. He softened when he saw the children had drawn pictures of flowers and vegetables and people sitting on benches. "Fine," he said. "But I will be watching."

The garden grew. Sunflowers reached toward the sky. Tomatoes turned red on the vine. Pumpkins swelled into orange basketballs. The children watered and weeded every day. Other residents started coming up to see the garden. Mrs. Patel brought her knitting. Mr. Rodriguez brought his guitar. The rooftop became a gathering place.

Chen''s English improved as he worked alongside his new friends. "This flower is yellow," he said one day, pointing. "Yes!" Maya cheered. "Sunflower!" Chen smiled.

At the end of summer, they had a harvest party. They made tomato sauce, roasted pumpkin seeds, and arranged sunflowers in mason jars. Mr. Henderson came and brought cookies. "I was wrong about the garden," he admitted. "This is the best thing that has happened to this building in thirty years."

The Sky Garden became a permanent part of the building. Every spring, new seeds were planted. Every summer, flowers bloomed and vegetables grew. And every day, four friends who had been strangers found each other on a rooftop among the clouds.',
  80,
  4.8,
  'https://placehold.co/400x600/27AE60/FFFFFF?text=The+Sky+Garden'
)

ON CONFLICT DO NOTHING;
