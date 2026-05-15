import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const DEMO_EMAIL = 'demo@pitchside.app'

function daysFromNow(days: number): Date {
  return new Date(Date.now() + days * 86_400_000)
}

async function main() {
  const passwordHash = await bcrypt.hash('DemoPass123', 10)

  let user = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
    include: { profile: true },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: DEMO_EMAIL,
        passwordHash,
        profile: {
          create: {
            displayName: 'Demo Player',
            city: 'Bengaluru',
            ageGroup: 'OPEN',
            primaryMode: 'FOOTBALL',
            onboardingStep: 5,
            onboardingCompleted: true,
            profileModes: {
              create: [{ mode: 'FOOTBALL' }, { mode: 'FUTSAL' }, { mode: 'CRICKET' }],
            },
          },
        },
      },
      include: { profile: true },
    })
  } else {
    if (!user.profile) {
      throw new Error('Demo user exists without profile — fix data manually')
    }
    await prisma.profileMode.deleteMany({ where: { profileId: user.profile.id } })
    await prisma.profileMode.createMany({
      data: [
        { profileId: user.profile.id, mode: 'FOOTBALL' },
        { profileId: user.profile.id, mode: 'FUTSAL' },
        { profileId: user.profile.id, mode: 'CRICKET' },
      ],
    })
    await prisma.profile.update({
      where: { id: user.profile.id },
      data: {
        city: 'Bengaluru',
        primaryMode: 'FOOTBALL',
        onboardingCompleted: true,
      },
    })
    user = await prisma.user.findUnique({
      where: { email: DEMO_EMAIL },
      include: { profile: true },
    })
  }

  if (!user?.profile) {
    throw new Error('Demo user profile missing after seed')
  }

  const demoUserId = user.id

  const MATE_EMAIL = 'seedmate@pitchside.app'
  let mateUser = await prisma.user.findUnique({
    where: { email: MATE_EMAIL },
    include: { profile: true },
  })
  if (!mateUser) {
    mateUser = await prisma.user.create({
      data: {
        email: MATE_EMAIL,
        passwordHash,
        profile: {
          create: {
            displayName: 'Seed teammate',
            city: 'Bengaluru',
            ageGroup: 'OPEN',
            primaryMode: 'FOOTBALL',
            onboardingStep: 5,
            onboardingCompleted: true,
            profileModes: { create: [{ mode: 'FOOTBALL' }] },
          },
        },
      },
      include: { profile: true },
    })
  } else if (!mateUser.profile) {
    throw new Error('Seed mate user exists without profile — fix data manually')
  }
  const mateUserId = mateUser.id

  const games: Array<{
    id: string
    gameMode: string
    title: string
    venueName: string
    city: string
    startsAt: Date
    spotsTotal: number
    spotsFilled: number
    skillLevel: string
    priceInrPerPlayer: number
    hostUserId: string | null
    urgentNeedPlayers: boolean
  }> = [
    {
      id: 'seed_blr_foot_near',
      gameMode: 'FOOTBALL',
      title: 'Sunset 7s — Open invite',
      venueName: 'AstroKick Arena',
      city: 'Bengaluru',
      startsAt: daysFromNow(1),
      spotsTotal: 14,
      spotsFilled: 9,
      skillLevel: 'INTERMEDIATE',
      priceInrPerPlayer: 200,
      hostUserId: demoUserId,
      urgentNeedPlayers: false,
    },
    {
      id: 'seed_blr_fut_urgent',
      gameMode: 'FUTSAL',
      title: 'Late-night 5v5 — 2 spots left',
      venueName: 'Urban Box Koramangala',
      city: 'Bengaluru',
      startsAt: daysFromNow(2),
      spotsTotal: 10,
      spotsFilled: 8,
      skillLevel: 'CASUAL',
      priceInrPerPlayer: 150,
      hostUserId: null,
      urgentNeedPlayers: true,
    },
    {
      id: 'seed_blr_next_match',
      gameMode: 'FOOTBALL',
      title: 'Weekend league kickabout',
      venueName: 'South United Grounds',
      city: 'Bengaluru',
      startsAt: daysFromNow(3),
      spotsTotal: 16,
      spotsFilled: 11,
      skillLevel: 'INTERMEDIATE',
      priceInrPerPlayer: 250,
      hostUserId: null,
      urgentNeedPlayers: false,
    },
    {
      id: 'seed_blr_cricket',
      gameMode: 'CRICKET',
      title: 'Box cricket — evening slot',
      venueName: 'StrikeZone Indiranagar',
      city: 'Bengaluru',
      startsAt: daysFromNow(4),
      spotsTotal: 12,
      spotsFilled: 6,
      skillLevel: 'OPEN',
      priceInrPerPlayer: 300,
      hostUserId: null,
      urgentNeedPlayers: false,
    },
    {
      id: 'seed_blr_foot_later',
      gameMode: 'FOOTBALL',
      title: 'Corporate friendly 8v8',
      venueName: 'HAL Sports Club',
      city: 'Bengaluru',
      startsAt: daysFromNow(9),
      spotsTotal: 20,
      spotsFilled: 12,
      skillLevel: 'BEGINNER',
      priceInrPerPlayer: 0,
      hostUserId: null,
      urgentNeedPlayers: false,
    },
  ]

  for (const g of games) {
    const { id, ...rest } = g
    await prisma.game.upsert({
      where: { id },
      create: {
        id,
        ...rest,
        isPublic: true,
        lifecycleState: 'OPEN',
        minPlayersToConfirm: rest.spotsTotal,
        genderFormat: 'OPEN',
      },
      update: {
        ...rest,
        isPublic: true,
        lifecycleState: 'OPEN',
        minPlayersToConfirm: rest.spotsTotal,
      },
    })
  }

  const PAST_RATINGS_GAME_ID = 'seed_game_past_ratings'
  await prisma.game.upsert({
    where: { id: PAST_RATINGS_GAME_ID },
    create: {
      id: PAST_RATINGS_GAME_ID,
      gameMode: 'FOOTBALL',
      title: 'Finished pickup (seed)',
      venueName: 'Demo Ground',
      city: 'Bengaluru',
      startsAt: daysFromNow(-2),
      spotsTotal: 10,
      spotsFilled: 2,
      skillLevel: 'OPEN',
      priceInrPerPlayer: 100,
      hostUserId: demoUserId,
      isPublic: true,
      urgentNeedPlayers: false,
      lifecycleState: 'COMPLETED',
      minPlayersToConfirm: 10,
      winnerSide: 'DRAW',
      completedAt: daysFromNow(-1),
    },
    update: {
      startsAt: daysFromNow(-2),
      spotsFilled: 2,
      hostUserId: demoUserId,
      isPublic: true,
      lifecycleState: 'COMPLETED',
      completedAt: daysFromNow(-1),
    },
  })
  await prisma.gameParticipant.upsert({
    where: { gameId_userId: { gameId: PAST_RATINGS_GAME_ID, userId: demoUserId } },
    create: { gameId: PAST_RATINGS_GAME_ID, userId: demoUserId },
    update: {},
  })
  await prisma.gameParticipant.upsert({
    where: { gameId_userId: { gameId: PAST_RATINGS_GAME_ID, userId: mateUserId } },
    create: { gameId: PAST_RATINGS_GAME_ID, userId: mateUserId },
    update: {},
  })
  await prisma.gameTeammateRating.upsert({
    where: {
      gameId_raterUserId_subjectUserId: {
        gameId: PAST_RATINGS_GAME_ID,
        raterUserId: mateUserId,
        subjectUserId: demoUserId,
      },
    },
    create: {
      gameId: PAST_RATINGS_GAME_ID,
      raterUserId: mateUserId,
      subjectUserId: demoUserId,
      skill: 4,
      effort: 4,
      attitude: 4,
      communication: 4,
      noShow: false,
    },
    update: { skill: 4, effort: 4, attitude: 4, communication: 4, noShow: false },
  })

  await prisma.gameParticipant.upsert({
    where: {
      gameId_userId: { gameId: 'seed_blr_next_match', userId: demoUserId },
    },
    create: { gameId: 'seed_blr_next_match', userId: demoUserId },
    update: {},
  })

  const tournaments = [
    {
      id: 'seed_tour_blr_foot',
      name: 'Monsoon Cup — Bengaluru',
      gameMode: 'FOOTBALL',
      city: 'Bengaluru',
      startsAt: daysFromNow(21),
      entryFeeInr: 2500,
      prizeInr: 75000,
      teamsRegistered: 6,
      teamsCap: 16,
      format: '7v7',
    },
    {
      id: 'seed_tour_blr_fut',
      name: 'Futsal Fridays',
      gameMode: 'FUTSAL',
      city: 'Bengaluru',
      startsAt: daysFromNow(14),
      entryFeeInr: 1500,
      prizeInr: 30000,
      teamsRegistered: 10,
      teamsCap: 12,
      format: '5v5',
    },
  ]

  for (const t of tournaments) {
    const { id, ...rest } = t
    await prisma.tournament.upsert({
      where: { id },
      create: { id, ...rest, genderFormat: 'OPEN' },
      update: { ...rest, genderFormat: 'OPEN' },
    })
  }

  const feed = [
    {
      id: 'seed_feed_1',
      type: 'ANNOUNCEMENT',
      title: 'Pitchside Phase 2 is live',
      body: 'Home dashboard, games, and tournaments are wired to the API.',
      city: null as string | null,
      gameMode: null as string | null,
    },
    {
      id: 'seed_feed_2',
      type: 'CITY',
      title: 'New partner turf in Koramangala',
      body: 'AstroKick Arena joined split-pay bookings.',
      city: 'Bengaluru',
      gameMode: 'FOOTBALL' as string | null,
    },
    {
      id: 'seed_feed_3',
      type: 'MODE',
      title: 'Futsal ladder reset',
      body: 'May ladder rankings start fresh this Monday.',
      city: null,
      gameMode: 'FUTSAL',
    },
    {
      id: 'seed_feed_4',
      type: 'CITY',
      title: 'Cricket nets — bulk slots',
      body: 'Book 10 sessions and save 15% this month in Bengaluru.',
      city: 'Bengaluru',
      gameMode: 'CRICKET',
    },
  ]

  for (const f of feed) {
    const { id, ...rest } = f
    await prisma.feedEvent.upsert({
      where: { id },
      create: { id, ...rest },
      update: { ...rest },
    })
  }

  const turfs = [
    {
      id: 'turf-1',
      name: 'AstroKick Arena',
      area: 'Koramangala',
      city: 'Bengaluru',
      modes: ['FOOTBALL', 'FUTSAL'],
      rating: 4.7,
      reviewCount: 124,
      priceInrPerHour: 1200,
      partner: true,
      availabilityNote: '3 slots today',
    },
    {
      id: 'turf-2',
      name: 'GoalZone Futsal',
      area: 'Bandra',
      city: 'Mumbai',
      modes: ['FUTSAL'],
      rating: 4.5,
      reviewCount: 98,
      priceInrPerHour: 900,
      partner: true,
      availabilityNote: 'Fully Booked',
    },
    {
      id: 'turf-3',
      name: 'Pitch Perfect',
      area: 'Hauz Khas',
      city: 'Delhi',
      modes: ['FOOTBALL'],
      rating: 4.8,
      reviewCount: 210,
      priceInrPerHour: 1500,
      partner: true,
      availabilityNote: '3 slots today',
    },
    {
      id: 'turf-4',
      name: 'StrikeZone Box Cricket',
      area: 'Andheri',
      city: 'Mumbai',
      modes: ['CRICKET'],
      rating: 4.6,
      reviewCount: 76,
      priceInrPerHour: 1100,
      partner: true,
      availabilityNote: '2 slots today',
    },
  ]

  for (const t of turfs) {
    const { id, modes, ...rest } = t
    await prisma.turf.upsert({
      where: { id },
      create: { id, modes, ...rest },
      update: { modes, ...rest },
    })
  }

  await prisma.turfBooking.upsert({
    where: { id: 'seed_booking_demo_1' },
    create: {
      id: 'seed_booking_demo_1',
      userId: demoUserId,
      turfId: 'turf-1',
      gameMode: 'FOOTBALL',
      bookingDate: new Date().toISOString().slice(0, 10),
      slotStartsJson: ['18:00', '19:00'],
      expectedPlayers: 10,
      splitPayment: true,
      totalInr: 2400,
      status: 'PENDING_PAYMENT',
    },
    update: {
      slotStartsJson: ['18:00', '19:00'],
      totalInr: 2400,
      status: 'PENDING_PAYMENT',
    },
  })

  await prisma.team.upsert({
    where: { id: 'seed_team_blr_kora' },
    create: {
      id: 'seed_team_blr_kora',
      name: 'Koramangala Kings FC',
      city: 'Bengaluru',
      gameMode: 'FOOTBALL',
      kitColorHex: '#1A56DB',
      captainUserId: demoUserId,
    },
    update: {
      name: 'Koramangala Kings FC',
      city: 'Bengaluru',
      gameMode: 'FOOTBALL',
      kitColorHex: '#1A56DB',
      captainUserId: demoUserId,
    },
  })
  await prisma.teamMember.upsert({
    where: {
      teamId_userId: { teamId: 'seed_team_blr_kora', userId: demoUserId },
    },
    create: {
      teamId: 'seed_team_blr_kora',
      userId: demoUserId,
      role: 'CAPTAIN',
    },
    update: { role: 'CAPTAIN' },
  })

  await prisma.notification.upsert({
    where: { id: 'seed_notif_demo_1' },
    create: {
      id: 'seed_notif_demo_1',
      userId: demoUserId,
      type: 'GAME',
      title: 'Game tonight near you',
      body: 'A 5v5 slot opened up in Koramangala — tap to browse games.',
      read: false,
      actionPath: '/games',
    },
    update: {
      title: 'Game tonight near you',
      body: 'A 5v5 slot opened up in Koramangala — tap to browse games.',
      type: 'GAME',
      actionPath: '/games',
    },
  })
  await prisma.notification.upsert({
    where: { id: 'seed_notif_demo_2' },
    create: {
      id: 'seed_notif_demo_2',
      userId: demoUserId,
      type: 'BOOKING',
      title: 'Turf booking reminder',
      body: 'Your split-pay booking is still pending payment from one player.',
      read: false,
      actionPath: '/book/mine',
    },
    update: {
      title: 'Turf booking reminder',
      body: 'Your split-pay booking is still pending payment from one player.',
      type: 'BOOKING',
      actionPath: '/book/mine',
    },
  })

  await prisma.trainingSettings.upsert({
    where: { userId: demoUserId },
    create: { userId: demoUserId, weeklyGoalMinutes: 300 },
    update: {},
  })
  await prisma.trainingSession.deleteMany({ where: { userId: demoUserId } })
  const seedSession = (id: string, dayOffsetFromUtcToday: number, durationMinutes: number) => {
    const day = new Date()
    day.setUTCHours(0, 0, 0, 0)
    day.setUTCDate(day.getUTCDate() + dayOffsetFromUtcToday)
    const startedAt = new Date(day)
    startedAt.setUTCHours(7, 0, 0, 0)
    const endedAt = new Date(startedAt.getTime() + durationMinutes * 60_000)
    return prisma.trainingSession.create({
      data: {
        id,
        userId: demoUserId,
        startedAt,
        endedAt,
        durationMinutes,
      },
    })
  }
  await seedSession('seed_train_demo_d0', 0, 22)
  await seedSession('seed_train_demo_d1', -1, 35)
  await seedSession('seed_train_demo_d2', -2, 18)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
