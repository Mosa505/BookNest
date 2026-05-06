-- Clean seed file for BookNest

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Fiction and novels - stories from imagination'),
('History', 'Historical books and accounts of past events'),
('Science', 'Science and nature - explore the world'),
('Kids', 'Children''s books - age-appropriate stories'),
('Biography', 'Biographical works - life stories'),
('Technology', 'Technology and computing - modern innovations')
ON CONFLICT DO NOTHING;

-- Insert kids books with content (7 columns)
INSERT INTO books (title, author, category, difficulty, description, content, total_pages, rating) VALUES
('The Little Prince', 'Antoine de Saint-Exupéry', 'Kids', 'A1', 'A classic children''s book about a young prince', 'Once when I was six I saw a picture of a boa constrictor swallowing an animal. I drew my masterpiece but grown-ups thought it was a hat. I drew the inside to explain - it was a boa digesting an elephant. That''s how I gave up my painting career and became a pilot.', 96, 4.8),
('Charlotte''s Web', 'E.B. White', 'Kids', 'A2', 'A story of friendship between a pig and a spider', 'Fern saved a little pig called Wilbur. At the farm, Charlotte the spider weaves words into her web to save Wilbur from being slaughtered. Words like "Some Pig" and "Terrific" appear in the web, amazing everyone.', 184, 4.7),
('The Very Hungry Caterpillar', 'Eric Carle', 'Kids', 'A1', 'A picture book about transformation', 'In the light of the moon a little egg lay on a leaf. Sunday morning, out popped a tiny caterpillar. Monday he ate one apple, Tuesday two pears, Wednesday three plums, Thursday four strawberries, Friday five oranges. Saturday he ate too much and got a stomachache! Sunday he ate a green leaf, built a cocoon, and became a beautiful butterfly!', 26, 4.9),
('Goodnight Moon', 'Margaret Wise Brown', 'Kids', 'A1', 'A calming bedtime story for children', 'In the great green room there was a telephone, red balloon, and picture of a cow jumping over the moon. Goodnight room, goodnight moon. Goodnight bears, goodnight chairs. Goodnight kittens, goodnight mittens. Goodnight stars, goodnight air, goodnight noises everywhere.', 32, 4.9),
('Where the Wild Things Are', 'Maurice Sendak', 'Kids', 'A2', 'A story about a boy''s imagination and adventure', 'Max wore his wolf suit and made mischief. His mother called him "WILD THING!" and sent him to bed. That night his room became a forest and he sailed to where the wild things are. He tamed them with a magic trick and became their king. But then he smelled good things to eat and wanted to go home.', 48, 4.8),
('The Cat in the Hat', 'Dr. Seuss', 'Kids', 'A1', 'A fun story about a cat who brings chaos', 'The sun did not shine. It was too wet to play. Then the Cat in the Hat appeared! He balanced on a ball with books and cups. He brought out Thing One and Thing Two who made a mess. But then the Cat cleaned everything up with a magical machine before mother came home!', 64, 4.8),
('Green Eggs and Ham', 'Dr. Seuss', 'Kids', 'A1', 'A story about trying new things', 'Sam-I-am asks if you like green eggs and ham. "Would you like them here or there? Would you like them in a house?" The character refuses until finally trying them - and loving them! "I do so like green eggs and ham! Thank you, Sam-I-am!"', 62, 4.9),
('The BFG', 'Roald Dahl', 'Kids', 'A2', 'A story about a big friendly giant', 'Sophie is snatched from her orphanage by the BFG - Big Friendly Giant. He catches dreams and blows them into children''s bedrooms. They team up to stop the man-eating giants by getting help from the Queen of England.', 224, 4.7),
('Matilda', 'Roald Dahl', 'Kids', 'A2', 'A story about a brilliant girl with special powers', 'Matilda is a genius who can move things with her eyes! Her parents don''t care about books, but she loves reading. At school, the terrible Miss Trunchbull throws children around. With her powers, Matilda helps the lovely Miss Honey get her house back.', 240, 4.8),
('Pippi Longstocking', 'Astrid Lindgren', 'Kids', 'A2', 'Adventures of the strongest girl in the world', 'Pippi lives at Villa Villekulla with a horse and monkey. She''s the strongest girl in the world - she can lift her horse with one hand! She has gold coins, doesn''t go to school, and loves adventure with her neighbors Tommy and Annika.', 160, 4.6),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Kids', 'B1', 'The beginning of the magical journey', 'Harry lives with the Dursleys who treat him terribly. On his 11th birthday, Hagrid tells him he''s a wizard! He goes to Hogwarts, makes friends Ron and Hermione, and discovers the truth about his parents'' death at the hands of Lord Voldemort.', 320, 4.9),
('The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 'Kids', 'B1', 'A magical adventure through a wardrobe', 'Four children - Peter, Susan, Edmund, and Lucy - find Narnia through a wardrobe. It''s always winter but never Christmas under the White Witch. With Aslan the lion, they fight to bring spring back to Narnia.', 208, 4.7);

-- Insert non-kids books (7 columns, content is NULL)
INSERT INTO books (title, author, category, difficulty, description, content, total_pages, rating) VALUES
('Pride and Prejudice', 'Jane Austen', 'Fiction', 'B2', 'A romantic novel set in Georgian England', NULL, 279, 4.7),
('Sense and Sensibility', 'Jane Austen', 'Fiction', 'B1', 'A tale of two sisters and their romantic journeys', NULL, 325, 4.6),
('A Brief History of Time', 'Stephen Hawking', 'Science', 'C1', 'Exploring cosmology and physics from big bang to black holes', NULL, 256, 4.6),
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', 'B1', 'The American dream in the Jazz Age', NULL, 180, 4.5),
('1984', 'George Orwell', 'Fiction', 'B2', 'A dystopian novel about totalitarianism', NULL, 328, 4.7),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'B2', 'A story about racial injustice and growing up', NULL, 324, 4.8),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', 'B1', 'A teenage protagonist''s journey through New York', NULL, 277, 4.4),
('A Tale of Two Cities', 'Charles Dickens', 'History', 'B2', 'Love and sacrifice during the French Revolution', NULL, 489, 4.5),
('The History of the Decline and Fall', 'Edward Gibbon', 'History', 'C2', 'Comprehensive history of the Roman Empire', NULL, 1000, 4.3),
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Science', 'B2', 'Understanding how we think and make decisions', NULL, 499, 4.5),
('Sapiens', 'Yuval Noah Harari', 'History', 'B2', 'A brief history of humankind', NULL, 443, 4.7),
('The Code Breaker', 'Walter Isaacson', 'Biography', 'B1', 'The life of Jennifer Doudna and CRISPR', NULL, 528, 4.6)
ON CONFLICT DO NOTHING;

-- Insert achievements
INSERT INTO achievements (name, description, badge_color, criteria_json) VALUES
('First Steps', 'Complete your first book', '#FFD700', '{"type":"book_completed","count":1}'),
('Bookworm', 'Complete 5 books', '#C0C0C0', '{"type":"book_completed","count":5}'),
('Book Collector', 'Complete 10 books', '#CD7F32', '{"type":"book_completed","count":10}'),
('Vocabulary Apprentice', 'Learn 10 words', '#87CEEB', '{"type":"vocabulary_count","count":10}'),
('Vocabulary Master', 'Learn 50 words', '#4169E1', '{"type":"vocabulary_count","count":50}'),
('Quiz Champion', 'Score 100% on a quiz', '#FF6347', '{"type":"quiz_score","score":100}'),
('Consistent Reader', 'Read for 7 consecutive days', '#32CD32', '{"type":"reading_streak","days":7}'),
('Week Warrior', 'Read for 14 consecutive days', '#228B22', '{"type":"reading_streak","days":14}'),
('Speed Reader', 'Complete a book in one day', '#FF1493', '{"type":"book_completed_one_day","count":1}'),
('Early Bird', 'Complete a reading session before 8 AM', '#FFD700', '{"type":"early_read","count":1}')
ON CONFLICT DO NOTHING;

-- Insert kids-specific achievements
INSERT INTO achievements (name, description, badge_color, criteria_json) VALUES
('Little Reader', 'Read your first kids book', '#FF69B4', '{"type":"book_completed","category":"Kids","count":1}'),
('Quiz Whiz Kid', 'Score 100% on a kids book quiz', '#FFD700', '{"type":"quiz_score","category":"Kids","score":100}'),
('Note Buddy', 'Write your first note on a kids book', '#87CEEB', '{"type":"note_created","category":"Kids","count":1}'),
('Story Explorer', 'Read 3 kids books', '#32CD32', '{"type":"book_completed","category":"Kids","count":3}'),
('Super Reader', 'Read 5 kids books', '#FF1493', '{"type":"book_completed","category":"Kids","count":5}')
ON CONFLICT DO NOTHING;

-- Insert admin user (password: admin123 - bcrypt hash)
INSERT INTO auth_users (email, password_hash, full_name, is_admin) VALUES
('admin@booknest.com', '$2a$10$YourBcryptHashHere', 'Admin User', TRUE)
ON CONFLICT DO NOTHING;

-- Insert demo user (password: demo123)
INSERT INTO auth_users (email, password_hash, full_name) VALUES
('demo@booknest.com', '$2a$10$YourBcryptHashHere', 'Demo User')
ON CONFLICT DO NOTHING;
