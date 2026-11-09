export interface Statement {
  id: number;
  raw: string;
  category?: string;
}

export const STATEMENTS_RAW: string[] = [
  // 1 - 10
  "You make *ordinary moments* feel important.",
  "Your *presence* changes the atmosphere.",
  "You notice the *little things*.",
  "You have a way of making people feel *seen*.",
  "Your strength doesn't always need to be *loud*.",
  "Some people are remembered *without trying*.",
  "Rooms feel *warmer* after you walk in.",
  "You listen as though *every word* matters.",
  "Silence feels *comfortable* when you are there.",
  "You carry calm into *noisy places*.",

  // 11 - 20
  "People *exhale* a little around you.",
  "You remember the details everyone assumed *nobody noticed*.",
  "Your laugh *rearranges* a room.",
  "You are *gentle* without ever being fragile.",
  "You say *thank you* like you mean it.",
  "You make *effort* look effortless.",
  "You ask the *second question*, the one that matters.",
  "Your *kindness* has no audience.",
  "You turn *strangers* into familiar faces.",
  "You leave places a little *better* than you found them.",

  // 21 - 30
  "You are *unmistakably* yourself.",
  "Your *honesty* is soft, but never vague.",
  "You hold *space* for people without announcing it.",
  "You *forgive* with a grace most people never learn.",
  "Your *patience* is a quiet kind of generosity.",
  "You know when to *speak*, and when to simply stay.",
  "You make *difficult days* feel survivable.",
  "Your *curiosity* keeps the world interesting.",
  "You find *beauty* in places others walk past.",
  "You *show up*, and that changes everything.",

  // 31 - 40
  "You are *steady* when others are shaking.",
  "Your *courage* rarely announces itself.",
  "You *believe in people* before they have proof.",
  "Your warmth is *never forced*.",
  "You are comfortable with *who you are becoming*.",
  "Your *quiet moments* say more than most speeches.",
  "You make simple plans feel like *occasions*.",
  "You *care* in specific, thoughtful ways.",
  "You notice *how people feel*, not only what they say.",
  "Your *consistency* is a gift to everyone near you.",

  // 41 - 50
  "You *disagree* gracefully.",
  "You *celebrate* other people's wins without keeping score.",
  "You are proof that *gentle people* endure.",
  "You give *credit* freely and take responsibility honestly.",
  "People *trust* you faster than they realize.",
  "Your *voice* sounds like reassurance.",
  "You make *waiting* feel shorter.",
  "Your *style* belongs entirely to you.",
  "You do small favors so naturally that *nobody can repay them*.",
  "You remember *birthdays, names*, and the stories behind them.",

  // 51 - 60
  "You have a *talent for timing*, and know when to lighten the mood.",
  "You turn *awkward* into easy.",
  "You make people feel *at home* almost anywhere.",
  "Your *humor* includes everyone.",
  "You carry *quietly* what would break others.",
  "You are *brave* in ways nobody applauds.",
  "You make good ideas feel *safe to say aloud*.",
  "You *encourage* without ever condescending.",
  "You *stay kind* when it would be easier not to.",
  "Your *standards* are high, and your grace is higher.",

  // 61 - 70
  "You notice who is *standing alone*.",
  "You can *change a mood* with a single sentence.",
  "People *borrow* your courage without ever telling you.",
  "You make *sincerity* look elegant.",
  "Your *influence* is felt long after you leave.",
  "You teach by *example*, never by lecture.",
  "You make *mistakes* feel human, not final.",
  "You *inspire* people to try without pressuring them.",
  "Your *words* stay with people for years.",
  "You are the reason *someone* kept going.",

  // 71 - 80
  "You turn *ordinary places* into memories.",
  "You *listen* between the lines.",
  "You are *gracious* in small moments, which is where it counts.",
  "You treat *everyone* as though they matter, because to you they do.",
  "Your *intuition* arrives quietly, then proves itself.",
  "You are *soft* and unshakable at the same time.",
  "You are *growing* in ways you don't always see.",
  "You have a presence that *cannot be imitated*.",
  "You are only *easy to miss* if no one is paying attention.",
  "You make *time* feel generous.",

  // 81 - 90
  "You *make room* at your table, and in your story.",
  "You show people how to be *gentler* with themselves.",
  "You have *depth* that reveals itself slowly.",
  "Your *loyalty* is quiet, and it never wavers.",
  "You can be *serious* without being distant.",
  "You are *thoughtful* in ways that never ask for thanks.",
  "You treat a *conversation* like something precious.",
  "You make good days *better* and heavy days lighter.",
  "Your *smile* has never felt like an obligation.",
  "You *understand* more than you say.",

  // 91 - 100
  "You leave people feeling *capable*.",
  "You make *belonging* feel simple.",
  "You shape the people around you, *gently and for good*.",
  "You are remembered in *details*: a phrase, a gesture, a tone.",
  "You *matter* in ways that never fit into one sentence.",
  "People *notice* when you are missing, and feel it when you return.",
  "You are the kind of person *people hope to become*.",
  "You *deserve* the same care you give so freely.",
  "The world is *quietly better* because you are in it.",
  "And these are *only a hundred* of the countless reasons."
];

export interface TextPart {
  text: string;
  isHighlighted: boolean;
}

export function parseStatement(raw: string): TextPart[] {
  const parts: TextPart[] = [];
  const regex = /\*([^*]+)\*/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(raw)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: raw.slice(lastIndex, match.index),
        isHighlighted: false
      });
    }
    parts.push({
      text: match[1],
      isHighlighted: true
    });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < raw.length) {
    parts.push({
      text: raw.slice(lastIndex),
      isHighlighted: false
    });
  }

  return parts;
}

export const STATEMENTS: Statement[] = STATEMENTS_RAW.map((raw, index) => ({
  id: index + 1,
  raw,
}));

