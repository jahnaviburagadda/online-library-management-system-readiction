const express = require('express');
const router  = express.Router();
const Book    = require('../models/Book');
const { protect, adminOnly } = require('../middleware/auth');

// ─── 15-PAGE CONTENT GENERATOR ──────────────────────────────────────────────
function makePages(title, author) {
  const chapters = [
    `${title}\n\nBy ${author}\n\n━━━ Chapter I ━━━\n\nThe morning the story began, the sky was the colour of old parchment — not quite white, not quite gold, but something in between that felt like possibility.\n\nNo one in the town noticed. People rarely notice beginnings. They are too busy living inside them.\n\nBut one person was watching. One person always is.`,
    `━━━ Chapter I — continued ━━━\n\n"It starts the way everything starts," the grandmother had said once, stirring tea that had long gone cold. "Quietly, in a room where no one is paying attention."\n\nShe had been right about many things. About this most of all.\n\nThe letter arrived on a Tuesday. Letters always arrive on Tuesdays in stories like this — there is something about the middle of the week that suits revelation.`,
    `━━━ Chapter II ━━━\n\nThe house at the end of the lane had been empty for eleven years. Children dared each other to touch the gate. Nobody ever went further than the gate.\n\nExcept once. Except now.\n\nThe door was unlocked. It had always been unlocked — waiting, as houses sometimes do, for the right person to arrive and understand what they were walking into.`,
    `━━━ Chapter II — continued ━━━\n\nInside: dust, and silence, and the particular quality of stillness that belongs to places where important things once happened and haven't quite finished happening yet.\n\nOn the table: a single cup. Still warm.\n\nSomebody had been here. Somebody had left in a hurry, or had left on purpose, which is sometimes the same thing.`,
    `━━━ Chapter III ━━━\n\nThe investigation, such as it was, began without a name. Without a clear victim. Without anything except the uneasy feeling that something had been wrong for a long time and everyone had agreed not to look at it directly.\n\nThat is how most things begin, if you're honest about it.\n\nAnd honesty, in this particular story, was going to cost somebody everything.`,
    `━━━ Chapter III — continued ━━━\n\n"I knew your father," the old man said, without turning around from the window.\n\n"Everybody knew my father."\n\n"Not the way I did." He turned then. His eyes were the pale grey of winter light through frosted glass. "Your father was the one who started all of this. I think you know that. I think that's why you're here."\n\nShe didn't answer. She had run out of answers three days ago. What she had left were questions, and the slowly forming suspicion that she had been asking the wrong ones.`,
    `━━━ Chapter IV ━━━\n\nThe market was busy. Markets in this city were always busy — a beautiful, overwhelming noise of voices and colour and the smell of spices that had travelled further than most people ever would.\n\nShe moved through it like someone who knew how to be invisible, which is to say: she moved with complete confidence and looked at nothing directly.\n\nThe contact was supposed to be at the third stall from the left. The third stall from the left was selling mirrors.`,
    `━━━ Chapter IV — continued ━━━\n\nShe saw herself reflected twelve times over: once in each mirror, each reflection slightly different depending on the angle, the light, the distance.\n\nWhich one was the real version? Which one was the one other people saw?\n\nShe had stopped trying to answer that question years ago. It turned out you could function perfectly well without an answer. You could function better, in fact. The question just made everything slower.`,
    `━━━ Chapter V ━━━\n\nThe document arrived in pieces. Four pages, mailed separately to four different addresses over the course of two weeks, as though whoever had sent them understood that the complete picture was dangerous and had decided to make danger arrive in instalments.\n\nWhen assembled: a map. An account. A name.\n\nThe name changed everything. The name had been right in front of them the whole time, hiding in plain sight the way names sometimes do.`,
    `━━━ Chapter V — continued ━━━\n\nBetrayal, she had learned, does not feel the way stories say it will. In stories it arrives like a blow — sudden, unmistakable, leaving you breathless on the floor.\n\nIn life it is slower. It seeps in at the edges. You notice it the way you notice the seasons changing: gradually, then all at once, then wondering how you ever believed it was summer.`,
    `━━━ Chapter VI ━━━\n\nThe night of the confrontation, it rained. Of course it rained. Weather in significant moments is not coincidence — it is the world's way of paying attention.\n\nThey stood in the doorway of the building that had started all of this, years ago, before either of them had known what anything meant.\n\n"You should have told me," she said.\n\n"You wouldn't have believed me."\n\nThis was true. She had been thinking it since she walked in. "What do we do now?"`,
    `━━━ Chapter VI — continued ━━━\n\nThe answer, it turned out, was simpler than either of them had expected. The complicated part was getting there — all the years of circling the truth without landing on it, all the careful avoidances and deliberate misreadings.\n\nNow that they were here, at the centre of it, the thing itself was almost ordinary. Almost small.\n\nAlmost. But not quite. It never is, in the end.`,
    `━━━ Chapter VII ━━━\n\nAfterwards, the town went back to what towns do: the market opened, the school bell rang, the pigeons disputed the fountain. Things that had seemed monumental contracted, over days and weeks, to their actual size.\n\nMemory is merciful in this way. It lets important things be large when you need them to be, and then quietly adjusts them so you can carry them.`,
    `━━━ Chapter VII — continued ━━━\n\nShe kept the letter. She didn't frame it or read it often — just knew it was there, in the drawer under the winter things, existing as proof that it had all happened.\n\nThat was enough.\n\nSome stories you need to be able to return to. Some you need to know you can return to, and never actually go back. The difference, she had decided, is whether you've made peace with the ending.`,
    `━━━ Epilogue ━━━\n\nA year later, she passed the house at the end of the lane. The gate was painted now — a deep green, cheerful against the stone wall. Someone had planted things in the garden that were clearly alive and deliberately tended.\n\nShe didn't stop. She didn't need to.\n\nThe story had ended the way good stories do: not with all the answers, but with the right questions finally being asked by the people who needed to ask them.\n\nThat, in the end, is enough.\n\n— End of Preview —`,
  ];
  return chapters.map((content, i) => ({ pageNumber: i + 1, content }));
}

// ═══════════════════════════════════════════════════════════════════════════
// ── BOOKS PAGE CATALOG — 24 books (4 per genre), all unique ──────────────
// Languages: English · French · Spanish · German · Italian · Japanese · Korean · Arabic
// ═══════════════════════════════════════════════════════════════════════════
const BROWSE = [
  // ── Classic ──
  { title: "Middlemarch",              author: "George Eliot",           genre: "Classic",  language: "English",  rating: 4.8, section: "browse",
    description: "A panoramic portrait of English provincial life, centred on the idealistic Dorothea Brooke.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop" },
  { title: "Notre-Dame de Paris",      author: "Victor Hugo",            genre: "Classic",  language: "French",   rating: 4.7, section: "browse",
    description: "The hunchback Quasimodo falls for the gypsy dancer Esmeralda in medieval Paris.",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=300&h=420&fit=crop" },
  { title: "Doña Perfecta",           author: "Benito Pérez Galdós",    genre: "Classic",  language: "Spanish",  rating: 4.4, section: "browse",
    description: "A clash between tradition and modernity tears a family apart in 19th-century Spain.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop" },
  { title: "Effi Briest",             author: "Theodor Fontane",        genre: "Classic",  language: "German",   rating: 4.5, section: "browse",
    description: "A young woman pays a devastating price for a youthful indiscretion in Prussian society.",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=420&fit=crop" },

  // ── Crime ──
  { title: "A Long Goodbye",           author: "Raymond Chandler",       genre: "Crime",    language: "English",  rating: 4.5, section: "browse",
    description: "Philip Marlowe's most personal case begins with a drunk in a parking lot and ends in tragedy.",
    coverImage: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=300&h=420&fit=crop" },
  { title: "Acque Amare",             author: "Gianrico Carofiglio",    genre: "Crime",    language: "Italian",  rating: 4.3, section: "browse",
    description: "A Bari defence lawyer takes a case everyone else has abandoned — and finds dangerous truth.",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4cdc8f97bd10?w=300&h=420&fit=crop" },
  { title: "The White Tiger",         author: "Aravind Adiga",          genre: "Crime",    language: "English",  rating: 4.4, section: "browse",
    description: "A driver's darkly comic confession of murder exposes the brutal class divide of modern India.",
    coverImage: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=420&fit=crop" },
  { title: "Snømannen",               author: "Jo Nesbø",               genre: "Crime",    language: "Norwegian",rating: 4.4, section: "browse",
    description: "Detective Harry Hole hunts a serial killer who leaves a snowman beside each victim.",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=420&fit=crop" },

  // ── Thriller ──
  { title: "The Girl with All the Gifts", author: "M.R. Carey",         genre: "Thriller", language: "English",  rating: 4.5, section: "browse",
    description: "A child with a unique gift may hold the key to humanity's survival in a post-outbreak world.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=420&fit=crop" },
  { title: "La Sombra del Viento",    author: "Carlos Ruiz Zafón",      genre: "Thriller", language: "Spanish",  rating: 4.8, section: "browse",
    description: "A boy discovers a book whose author seems to have been erased from history in post-war Barcelona.",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=420&fit=crop" },
  { title: "Der Turm",                author: "Uwe Tellkamp",           genre: "Thriller", language: "German",   rating: 4.3, section: "browse",
    description: "A bourgeois Dresden family navigates the final decade of the East German state.",
    coverImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=420&fit=crop" },
  { title: "Confessions",             author: "Kanae Minato",           genre: "Thriller", language: "Japanese", rating: 4.6, section: "browse",
    description: "A teacher's chilling announcement to her class sets off a spiral of revenge and guilt.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=420&fit=crop" },

  // ── Mystery ──
  { title: "The Moonstone",           author: "Wilkie Collins",         genre: "Mystery",  language: "English",  rating: 4.6, section: "browse",
    description: "The first detective novel in English follows a stolen diamond through a web of suspects.",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=420&fit=crop" },
  { title: "L'Adversaire",            author: "Emmanuel Carrère",       genre: "Mystery",  language: "French",   rating: 4.7, section: "browse",
    description: "A man spent 18 years pretending to be a doctor — until the day he murdered his family.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop" },
  { title: "El misterio de la cripta embrujada", author: "Eduardo Mendoza", genre: "Mystery", language: "Spanish", rating: 4.3, section: "browse",
    description: "A mental patient is released to solve a case the Barcelona police can't crack.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=420&fit=crop" },
  { title: "향수",                    author: "Patrick Süskind (tr.)",   genre: "Mystery",  language: "Korean",   rating: 4.5, section: "browse",
    description: "Korean edition of the classic tale of a man born without a scent obsessed with capturing the perfect fragrance.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=420&fit=crop" },

  // ── Fiction ──
  { title: "Pachinko",                author: "Min Jin Lee",            genre: "Fiction",  language: "English",  rating: 4.8, section: "browse",
    description: "Four generations of a Korean family fight for survival, dignity, and love in Japan.",
    coverImage: "https://images.unsplash.com/photo-1459664018906-085c36f472af?w=300&h=420&fit=crop" },
  { title: "Le Petit Prince",         author: "Antoine de Saint-Exupéry",genre:"Fiction",  language: "French",   rating: 4.9, section: "browse",
    description: "A pilot stranded in the desert meets a boy from another planet who teaches him to see.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=420&fit=crop" },
  { title: "Il Deserto dei Tartari",  author: "Dino Buzzati",           genre: "Fiction",  language: "Italian",  rating: 4.6, section: "browse",
    description: "A soldier waits his whole life at a remote fort for an enemy that may never come.",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=420&fit=crop" },
  { title: "The Remains of the Day",  author: "Kazuo Ishiguro",         genre: "Fiction",  language: "English",  rating: 4.7, section: "browse",
    description: "An English butler's road trip through the countryside becomes a quiet reckoning with his past.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop" },

  // ── Romance ──
  { title: "Atonement",               author: "Ian McEwan",             genre: "Romance",  language: "English",  rating: 4.6, section: "browse",
    description: "A child's misunderstanding destroys two lives and haunts a writer's conscience for decades.",
    coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=420&fit=crop" },
  { title: "Beloved",                 author: "Toni Morrison",          genre: "Romance",  language: "English",  rating: 4.7, section: "browse",
    description: "A freed slave is haunted by her past and the ghost of the daughter she could not let live.",
    coverImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=420&fit=crop" },
  { title: "La Regenta",              author: "Leopoldo Alas Clarín",   genre: "Romance",  language: "Spanish",  rating: 4.5, section: "browse",
    description: "A beautiful woman trapped in a loveless marriage is courted by two very different men in provincial Spain.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=420&fit=crop" },
  { title: "Satori",                  author: "Yasunari Kawabata",      genre: "Romance",  language: "Japanese", rating: 4.4, section: "browse",
    description: "A Zen tea master and a young woman circle each other in 1960s Kyoto, beauty masking sorrow.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop" },
];

// ═══════════════════════════════════════════════════════════════════════════
// ── GENRE PAGE CATALOG — 24 books (4 per genre), completely different ─────
// Languages: English · French · Spanish · German · Japanese · Russian · Portuguese · Dutch · Chinese
// ═══════════════════════════════════════════════════════════════════════════
const GENRE_BOOKS = [
  // ── Classic ──
  { title: "Silas Marner",            author: "George Eliot",           genre: "Classic",  language: "English",   rating: 4.4, section: "genre",
    description: "A miserly weaver's gold is stolen, but a golden-haired child fills the void in his heart.",
    coverImage: "https://images.unsplash.com/photo-1629992101753-56d196c8aabb?w=300&h=420&fit=crop" },
  { title: "Crime et Châtiment",      author: "Fiodor Dostoïevski",     genre: "Classic",  language: "French",    rating: 4.9, section: "genre",
    description: "French edition of the masterwork — a student's murder unravels into psychological torment.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=420&fit=crop" },
  { title: "Cuentos de la Alhambra",  author: "Washington Irving",      genre: "Classic",  language: "Spanish",   rating: 4.3, section: "genre",
    description: "Romantic legends and tales collected from the storied halls of the Alhambra palace.",
    coverImage: "https://images.unsplash.com/photo-1600189261867-30e5ffe7b8da?w=300&h=420&fit=crop" },
  { title: "Im Westen nichts Neues",  author: "Erich Maria Remarque",   genre: "Classic",  language: "German",    rating: 4.8, section: "genre",
    description: "A young German soldier's harrowing account of life and death on the First World War front.",
    coverImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=420&fit=crop" },

  // ── Crime ──
  { title: "A Is for Alibi",          author: "Sue Grafton",            genre: "Crime",    language: "English",   rating: 4.2, section: "genre",
    description: "PI Kinsey Millhone's first case — a woman just released from prison for murdering her husband.",
    coverImage: "https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=300&h=420&fit=crop" },
  { title: "هيكل الله",              author: "نجيب محفوظ",              genre: "Crime",    language: "Arabic",    rating: 4.5, section: "genre",
    description: "Naguib Mahfouz weaves crime and corruption through the alleys of old Cairo.",
    coverImage: "https://images.unsplash.com/photo-1476275466078-4cdc8f97bd10?w=300&h=420&fit=crop" },
  { title: "O Xangô de Baker Street", author: "Jô Soares",             genre: "Crime",    language: "Portuguese",rating: 4.3, section: "genre",
    description: "Sherlock Holmes visits 19th-century Rio de Janeiro to investigate a stolen Stradivarius.",
    coverImage: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=300&h=420&fit=crop" },
  { title: "三体",                    author: "Liu Cixin",              genre: "Crime",    language: "Chinese",   rating: 4.7, section: "genre",
    description: "During China's Cultural Revolution, a secret signal is sent to space — with terrifying consequences.",
    coverImage: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=420&fit=crop" },

  // ── Thriller ──
  { title: "The Firm",                author: "John Grisham",           genre: "Thriller", language: "English",   rating: 4.3, section: "genre",
    description: "A young lawyer discovers his prestigious new firm has a very dark secret.",
    coverImage: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=300&h=420&fit=crop" },
  { title: "Le Comte de Monte-Cristo", author: "Alexandre Dumas",       genre: "Thriller", language: "French",    rating: 4.9, section: "genre",
    description: "A wrongly imprisoned man escapes and orchestrates a masterful revenge across two decades.",
    coverImage: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=300&h=420&fit=crop" },
  { title: "Stieg Larsson: Millennium",author: "Stieg Larsson",        genre: "Thriller", language: "English",   rating: 4.6, section: "genre",
    description: "Journalist Mikael Blomkvist investigates a family's dark secrets on a remote Swedish island.",
    coverImage: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=300&h=420&fit=crop" },
  { title: "O Senhor do Labirinto",   author: "José Saramago",          genre: "Thriller", language: "Portuguese",rating: 4.5, section: "genre",
    description: "A retired classics professor becomes obsessed with proving a revolutionary literary theory.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=300&h=420&fit=crop" },

  // ── Mystery ──
  { title: "Appointment with Death",  author: "Agatha Christie",        genre: "Mystery",  language: "English",   rating: 4.5, section: "genre",
    description: "Hercule Poirot investigates the murder of a tyrannical matriarch on an archaeological dig.",
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=420&fit=crop" },
  { title: "Het Diner",               author: "Herman Koch",            genre: "Mystery",  language: "Dutch",     rating: 4.4, section: "genre",
    description: "Two couples meet for dinner to discuss what their sons have done — with chilling results.",
    coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=420&fit=crop" },
  { title: "Kizumonogatari",          author: "Nisioisin",              genre: "Mystery",  language: "Japanese",  rating: 4.3, section: "genre",
    description: "A high school student meets a powerful vampire on the night before spring break — nothing is the same after.",
    coverImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=420&fit=crop" },
  { title: "Mortal Engines",          author: "Philip Reeve",           genre: "Mystery",  language: "English",   rating: 4.4, section: "genre",
    description: "In a post-apocalyptic future, predator cities consume smaller towns for resources.",
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=420&fit=crop" },

  // ── Fiction ──
  { title: "Klara and the Sun",       author: "Kazuo Ishiguro",         genre: "Fiction",  language: "English",   rating: 4.6, section: "genre",
    description: "An Artificial Friend observes human nature from a store window before being chosen.",
    coverImage: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=420&fit=crop" },
  { title: "Ficciones",              author: "Jorge Luis Borges",       genre: "Fiction",  language: "Spanish",   rating: 4.9, section: "genre",
    description: "Labyrinthine stories about libraries, mirrors, and infinite possibilities by the master of the form.",
    coverImage: "https://images.unsplash.com/photo-1459664018906-085c36f472af?w=300&h=420&fit=crop" },
  { title: "Steppenwolf",            author: "Hermann Hesse",           genre: "Fiction",  language: "German",    rating: 4.5, section: "genre",
    description: "A middle-aged intellectual torn between the spiritual and the sensual confronts his dual nature.",
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=420&fit=crop" },
  { title: "Ensaio sobre a Cegueira", author: "José Saramago",          genre: "Fiction",  language: "Portuguese",rating: 4.8, section: "genre",
    description: "An epidemic of sudden blindness strips away civilisation in this allegorical masterpiece.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=420&fit=crop" },

  // ── Romance ──
  { title: "Persuasion",             author: "Jane Austen",             genre: "Romance",  language: "English",   rating: 4.8, section: "genre",
    description: "Anne Elliot gets a second chance with the man she was persuaded to reject eight years before.",
    coverImage: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=300&h=420&fit=crop" },
  { title: "センセイの鞄",            author: "川上弘美",                 genre: "Romance",  language: "Japanese",  rating: 4.6, section: "genre",
    description: "A woman in her mid-30s develops a quiet, tender relationship with her elderly former teacher.",
    coverImage: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&h=420&fit=crop" },
  { title: "Crianças do Tempo Perdido",author: "Lídia Jorge",           genre: "Romance",  language: "Portuguese",rating: 4.4, section: "genre",
    description: "A sweeping story of love and loss across generations of a Portuguese family.",
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=420&fit=crop" },
  { title: "Het Achterhuis",          author: "Anne Frank",             genre: "Romance",  language: "Dutch",     rating: 4.9, section: "genre",
    description: "The diary of a Jewish girl hiding from the Nazis — one of the most powerful human documents ever written.",
    coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=420&fit=crop" },
];

const ALL_SEED = [...BROWSE, ...GENRE_BOOKS];

async function ensureSeeded() {
  const browseCount = await Book.countDocuments({ section: 'browse' });
  const genreCount  = await Book.countDocuments({ section: 'genre'  });

  // Reseed if either section is missing or has wrong count
  if (browseCount !== BROWSE.length || genreCount !== GENRE_BOOKS.length) {
    console.log(`🔄 Reseeding books (browse: ${browseCount}/${BROWSE.length}, genre: ${genreCount}/${GENRE_BOOKS.length})`);
    await Book.deleteMany({});
    const docs = ALL_SEED.map(b => ({
      ...b,
      pages: makePages(b.title, b.author),
      totalPages: 15,
    }));
    await Book.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} books (${BROWSE.length} browse + ${GENRE_BOOKS.length} genre)`);
  }
}

// ─── ROUTES ─────────────────────────────────────────────────────────────────

// POST /api/books/reseed — force reseed (admin)
router.post("/reseed", protect, adminOnly, async (req, res) => {
  try {
    await Book.deleteMany({});
    const docs = ALL_SEED.map(b => ({ ...b, pages: makePages(b.title, b.author), totalPages: 15 }));
    await Book.insertMany(docs);
    res.json({ message: `Reseeded ${docs.length} books`, browse: BROWSE.length, genre: GENRE_BOOKS.length });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/books  — browse catalog
router.get('/', async (req, res) => {
  try {
    await ensureSeeded();
    res.json(await Book.find({ section: 'browse' }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/books/genre-section  — genre page catalog
router.get('/genre-section', async (req, res) => {
  try {
    await ensureSeeded();
    res.json(await Book.find({ section: 'genre' }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/books/genre/:genre  — filtered from genre section
router.get('/genre/:genre', async (req, res) => {
  try {
    await ensureSeeded();
    res.json(await Book.find({ genre: req.params.genre, section: 'genre' }));
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// GET /api/books/:id  — single book with pages
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// POST /api/books  — admin add
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, author, genre, rating, description, coverImage, section, language } = req.body;
    const book = await Book.create({
      title, author, genre, rating, description, coverImage,
      language: language || 'English',
      section:  section  || 'browse',
      pages: makePages(title, author),
      totalPages: 15,
      addedBy: req.user._id,
    });
    res.status(201).json(book);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// DELETE /api/books/:id  — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (e) { res.status(500).json({ message: e.message }); }
});

// PUT /api/books/:id  — admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(book);
  } catch (e) { res.status(500).json({ message: e.message }); }
});

module.exports = router;
