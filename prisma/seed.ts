import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (seed: string) => `https://picsum.photos/seed/${seed}/1200/800`;
const SAMPLE_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";
const SAMPLE_AUDIO = "https://www.w3schools.com/html/horse.mp3";

const ACHIEVEMENTS = [
  { key: "WELCOME", name: "Enlisted", description: "Joined the Detective's Guild.", icon: "Fingerprint", tier: "BRONZE" },
  { key: "FIRST_CASE", name: "On the Case", description: "Submitted your first investigation.", icon: "FileSearch", tier: "BRONZE" },
  { key: "FIRST_SOLVE", name: "First Blood", description: "Correctly solved your first case.", icon: "Sparkles", tier: "SILVER" },
  { key: "SHARP_EYE", name: "Sharp Eye", description: "Solved 3 cases correctly.", icon: "Eye", tier: "SILVER" },
  { key: "MASTERMIND", name: "Mastermind", description: "Solved 10 cases correctly.", icon: "Brain", tier: "GOLD" },
  { key: "EXPERT_SOLVER", name: "Nerves of Steel", description: "Cracked an Expert-difficulty case.", icon: "Flame", tier: "GOLD" },
  { key: "POINTS_500", name: "Rising Star", description: "Earned 500 points.", icon: "Star", tier: "SILVER" },
  { key: "POINTS_2000", name: "Legend of the Guild", description: "Earned 2000 points.", icon: "Crown", tier: "PLATINUM" },
];

type EvidenceSeed = {
  type: string;
  title: string;
  description?: string;
  url: string;
  fileName?: string;
};

type CaseSeed = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  briefing: string;
  difficulty: string;
  reward: number;
  coverImage: string;
  location: string;
  dateOccurred: string;
  status: string;
  featured: boolean;
  culprit: string;
  solutionSummary: string;
  evidence: EvidenceSeed[];
};

const CASES: CaseSeed[] = [
  {
    slug: "the-selwyn-hotel-murder",
    title: "The Selwyn Hotel Murder",
    subtitle: "A locked room, a broken alibi",
    summary:
      "Socialite Vivian Lockhart is found dead in room 507. No forced entry, one black glove fiber, and a lobby full of liars.",
    briefing: `On the night of October 31st, 1948, Vivian Lockhart checked into room 507 of the Selwyn Hotel — alone. By midnight she was dead, strangled, with no sign of forced entry.

Three people had reason to visit her that night: her estranged husband Charles, her business partner Marcus Vane, and the hotel's charming night manager. Each claims to have an alibi. Each is lying about something.

Study the coroner's findings, the doorman's statement, and the scene photographs. Note the amber cologne, the smudged signature, and which hand signed the guest book. The truth is in the details.`,
    difficulty: "MEDIUM",
    reward: 150,
    coverImage: img("selwyn-hotel"),
    location: "The Selwyn Hotel, Room 507",
    dateOccurred: "October 31, 1948",
    status: "OPEN",
    featured: true,
    culprit: "Marcus Vane",
    solutionSummary:
      "Marcus Vane, the left-handed business partner, wore the amber cologne and signed the guest book with his left hand. He strangled Vivian to hide their fraudulent gallery dealings.",
    evidence: [
      { type: "PHOTO", title: "Room 507 — Scene", description: "The overturned chair and open window.", url: img("room507") },
      { type: "PHOTO", title: "The Guest Book", description: "A smudged signature, ink dragged left to right.", url: img("guestbook") },
      { type: "PHOTO", title: "The Amber Cologne", description: "Found on the dresser of a nearby room.", url: img("cologne") },
      { type: "DOCUMENT", title: "Autopsy Report", description: "Office of the Medical Examiner.", url: "/downloads/autopsy-report.txt", fileName: "autopsy-report.txt" },
      { type: "DOCUMENT", title: "Doorman's Statement", description: "Arthur Penhallow, night doorman.", url: "/downloads/witness-statement.txt", fileName: "witness-statement.txt" },
      { type: "VIDEO", title: "Lobby CCTV", description: "Grainy footage from the lobby camera, 10:45 PM.", url: SAMPLE_VIDEO },
    ],
  },
  {
    slug: "the-amber-room-heist",
    title: "The Amber Room Heist",
    subtitle: "The perfect forgery",
    summary:
      "A £40,000 painting vanishes from a locked gallery hours after being re-insured. The paint is still wet on the frame.",
    briefing: `The Vane Gallery reported "The Amber Room" stolen on November 2nd — just three days after quietly re-insuring it for £40,000. The alarm never tripped. The vault was locked from the inside.

Curiously, a restorer noted the varnish on the empty frame was still tacky. Someone was in that gallery very recently, and they weren't stealing a masterpiece — they were covering a forgery.

Follow the ledger. Follow the insurance. The thief and the beneficiary are the same person.`,
    difficulty: "HARD",
    reward: 250,
    coverImage: img("amber-room"),
    location: "The Vane Gallery",
    dateOccurred: "November 2, 1948",
    status: "OPEN",
    featured: true,
    culprit: "Marcus Vane",
    solutionSummary:
      "Gallery owner Marcus Vane staged the theft of a painting he knew to be a forgery, collecting the inflated insurance payout he'd arranged days earlier.",
    evidence: [
      { type: "PHOTO", title: "The Empty Frame", description: "Varnish still tacky to the touch.", url: img("emptyframe") },
      { type: "PHOTO", title: "The Vault Door", description: "Locked from the inside. No damage.", url: img("vault") },
      { type: "DOCUMENT", title: "Gallery Ledger", description: "Recovered accounting entries.", url: "/downloads/ledger-excerpt.txt", fileName: "ledger-excerpt.txt" },
      { type: "AUDIO", title: "Anonymous Tip", description: "A muffled call to the station switchboard.", url: SAMPLE_AUDIO },
    ],
  },
  {
    slug: "the-last-train-to-vireaux",
    title: "The Last Train to Vireaux",
    subtitle: "Six passengers, one impossible crime",
    summary:
      "A financier is poisoned in a sealed sleeper car between stations. Every passenger has a motive and a secret.",
    briefing: `The 11:15 sleeper to Vireaux carried six passengers and one very unpopular financier, Edgar Croft. Somewhere between the tunnels, Croft drank his nightcap and never woke up.

The car was sealed. The conductor swears no one passed. The poison — a bitter almond scent — was in the brandy, but only Croft's glass was touched.

Watch who poured. Watch who lied about the time. The killer counted on the darkness of the tunnel.`,
    difficulty: "EXPERT",
    reward: 400,
    coverImage: img("train-vireaux"),
    location: "The Vireaux Express, Car 3",
    dateOccurred: "March 14, 1951",
    status: "OPEN",
    featured: true,
    culprit: "Eleanor Croft",
    solutionSummary:
      "Eleanor Croft, the financier's wife, poured the poisoned brandy during the tunnel blackout, exploiting the darkness to swap glasses. She stood to inherit everything.",
    evidence: [
      { type: "PHOTO", title: "The Sleeper Car", description: "Car 3, as found by the conductor.", url: img("sleepercar") },
      { type: "PHOTO", title: "The Brandy Decanter", description: "Only one glass shows residue.", url: img("brandy") },
      { type: "VIDEO", title: "Platform Footage", description: "Boarding at the origin station.", url: SAMPLE_VIDEO },
      { type: "PHOTO", title: "The Seating Chart", description: "Who sat where in Car 3.", url: img("seating") },
    ],
  },
  {
    slug: "the-lighthouse-keepers-secret",
    title: "The Lighthouse Keeper's Secret",
    subtitle: "The light that went dark",
    summary:
      "A keeper vanishes the night his lighthouse goes dark and a cargo ship runs aground. Wrecking, or something worse?",
    briefing: `On a storm-lashed coast, the Brindle Point light went dark for exactly forty minutes — long enough for the cargo ship Merrow to founder on the rocks. Keeper Silas Nye is missing.

Was Nye a victim, or was he paid to douse the light so the wreck could be plundered? The logbook has a torn page. The lamp oil was drained, not spent.

The tide brings answers. So does the ledger of the man who bought the salvage rights a week before the storm.`,
    difficulty: "MEDIUM",
    reward: 180,
    coverImage: img("lighthouse"),
    location: "Brindle Point Lighthouse",
    dateOccurred: "January 9, 1953",
    status: "OPEN",
    featured: false,
    culprit: "Josiah Kemp",
    solutionSummary:
      "Salvage broker Josiah Kemp bribed and then silenced keeper Nye, draining the lamp oil to wreck the Merrow so he could claim its cargo under his pre-arranged salvage rights.",
    evidence: [
      { type: "PHOTO", title: "The Dark Tower", description: "Brindle Point on the morning after.", url: img("darktower") },
      { type: "PHOTO", title: "The Torn Logbook", description: "A page ripped from the keeper's log.", url: img("logbook") },
      { type: "AUDIO", title: "Coastguard Radio", description: "Distress calls from the Merrow.", url: SAMPLE_AUDIO },
    ],
  },
  {
    slug: "a-study-in-scarlet-ink",
    title: "A Study in Scarlet Ink",
    subtitle: "The forged confession",
    summary:
      "A publisher is found dead beside a typed confession. But the typewriter tells a different story.",
    briefing: `Publisher Rowan Ashe was found slumped over his desk, a typed suicide note beside him. Case closed — until the police typist noticed the note's letter 'e' was crisp and clean.

Every typewriter in Ashe's office has a chipped 'e'. This note was typed elsewhere and planted. Someone wanted a murder to read as a suicide.

Compare the type samples. Find the machine. Find the hand that fed it paper.`,
    difficulty: "EASY",
    reward: 100,
    coverImage: img("scarlet-ink"),
    location: "Ashe & Co. Publishing House",
    dateOccurred: "June 2, 1950",
    status: "OPEN",
    featured: false,
    culprit: "Delia Ashe",
    solutionSummary:
      "Delia Ashe typed the fake confession on her own pristine home typewriter, then planted it to disguise the murder of her brother and seize control of the publishing house.",
    evidence: [
      { type: "PHOTO", title: "The Desk", description: "The scene as discovered by the cleaner.", url: img("deskscene") },
      { type: "PHOTO", title: "Type Sample — Office", description: "Note the chipped 'e'.", url: img("typesample1") },
      { type: "PHOTO", title: "Type Sample — The Note", description: "A flawless, crisp 'e'.", url: img("typesample2") },
    ],
  },
  {
    slug: "the-carnival-vanishing",
    title: "The Carnival Vanishing",
    subtitle: "Now you see her",
    summary:
      "A magician's assistant disappears mid-act and never reappears. The trick was real — and so was the crime.",
    briefing: `Under the big top, the Great Alvaro's assistant Mina stepped into the vanishing cabinet to thunderous applause. The cabinet opened empty. She was never seen again.

The trapdoor was bolted. The crew swears the cabinet never left the stage. Yet Mina's locket was found in the ringmaster's caravan, and the box office takings are short by a week's wages.

The audience saw a trick. You'll see a kidnapping — and the insider who made it possible.`,
    difficulty: "HARD",
    reward: 300,
    coverImage: img("carnival"),
    location: "The Alvaro Travelling Carnival",
    dateOccurred: "August 20, 1955",
    status: "OPEN",
    featured: false,
    culprit: "The Ringmaster",
    solutionSummary:
      "The Ringmaster rigged a second false panel and spirited Mina out through his own caravan, staging the 'vanishing' to cover the theft of the box office takings and silence her.",
    evidence: [
      { type: "PHOTO", title: "The Vanishing Cabinet", description: "Bolted trapdoor, empty interior.", url: img("cabinet") },
      { type: "PHOTO", title: "The Locket", description: "Found in the ringmaster's caravan.", url: img("locket") },
      { type: "VIDEO", title: "The Final Performance", description: "Amateur footage from the crowd.", url: SAMPLE_VIDEO },
      { type: "PHOTO", title: "Box Office Records", description: "A week's takings unaccounted for.", url: img("boxoffice") },
    ],
  },
];

async function main() {
  console.log("Seeding achievements…");
  for (const a of ACHIEVEMENTS) {
    await prisma.achievement.upsert({
      where: { key: a.key },
      update: a,
      create: a,
    });
  }

  console.log("Seeding users…");
  const pwd = await bcrypt.hash("detective123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@noir.io" },
    update: {},
    create: {
      email: "admin@noir.io",
      username: "chief",
      name: "Chief Inspector Hale",
      passwordHash: pwd,
      role: "ADMIN",
      points: 3200,
      bio: "Thirty years on the force. Now running the Guild.",
      location: "Metropolis",
    },
  });

  const demoUsers = [
    { email: "sam@noir.io", username: "samspade", name: "Sam Spade", points: 1450, location: "San Francisco" },
    { email: "nora@noir.io", username: "noraflynn", name: "Nora Flynn", points: 980, location: "Chicago" },
    { email: "ike@noir.io", username: "ikemoreau", name: "Ike Moreau", points: 420, location: "New Orleans" },
    { email: "detective@noir.io", username: "rookie", name: "New Recruit", points: 0, location: "Metropolis" },
  ];

  const users = [];
  for (const u of demoUsers) {
    const created = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        ...u,
        passwordHash: pwd,
        role: "USER",
        bio: "Chasing the truth, one case at a time.",
      },
    });
    users.push(created);
  }

  console.log("Seeding cases and evidence…");
  for (const c of CASES) {
    const { evidence, ...caseData } = c;
    const existing = await prisma.case.findUnique({ where: { slug: c.slug } });
    if (existing) {
      await prisma.evidence.deleteMany({ where: { caseId: existing.id } });
      await prisma.case.update({ where: { id: existing.id }, data: caseData });
      await prisma.evidence.createMany({
        data: evidence.map((e, i) => ({ ...e, caseId: existing.id, order: i })),
      });
    } else {
      const created = await prisma.case.create({ data: caseData });
      await prisma.evidence.createMany({
        data: evidence.map((e, i) => ({ ...e, caseId: created.id, order: i })),
      });
    }
  }

  console.log("Seeding a few submissions…");
  const selwyn = await prisma.case.findUnique({
    where: { slug: "the-selwyn-hotel-murder" },
  });
  const scarlet = await prisma.case.findUnique({
    where: { slug: "a-study-in-scarlet-ink" },
  });

  if (selwyn && scarlet && users[0]) {
    await prisma.submission.upsert({
      where: { id: "seed-sub-1" },
      update: {},
      create: {
        id: "seed-sub-1",
        caseId: selwyn.id,
        userId: users[0].id,
        suspect: "Marcus Vane",
        reasoning:
          "The amber cologne, the left-handed signature, and the fraudulent gallery ledger all point to Vane. He silenced Vivian before she could expose the forgery.",
        status: "CORRECT",
        score: 150,
      },
    });
    await prisma.submission.upsert({
      where: { id: "seed-sub-2" },
      update: {},
      create: {
        id: "seed-sub-2",
        caseId: scarlet.id,
        userId: users[1].id,
        suspect: "Charles Ashe",
        reasoning: "I think the brother did it for the inheritance.",
        status: "INCORRECT",
        score: 0,
      },
    });
  }

  console.log("Done.");
  console.log("Admin login:  admin@noir.io / detective123");
  console.log("Demo login:   sam@noir.io / detective123");
  void admin;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
