import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { seedUsers, seedEvents, seedGroups, seedCourses, seedMarketplace, seedDonations, seedContracts, settings as seedSettings, LEVELS } from '@/data/seed'

const uid = (p = 'id') => p + '-' + Math.random().toString(36).slice(2, 9)

const initial = {
  users: seedUsers,
  events: seedEvents,
  groups: seedGroups,
  courses: seedCourses,
  marketplace: seedMarketplace,
  donations: seedDonations,
  contracts: seedContracts,
  settings: seedSettings,
  sessionUserId: null,
}

function kpiToLevel(kpi) {
  return [...LEVELS].reverse().find((l) => kpi >= l.minKpi)?.id || 'wonder-woman'
}

function reducer(state, action) {
  const s = JSON.parse(JSON.stringify(state))
  switch (action.type) {
    case 'REGISTER': {
      const u = { id: uid('u'), role: 'user', level: 'wonder-woman', kpi: 0, followers: [], following: [], avatar: '', donateTotal: 0, ...action.user }
      s.users.push(u)
      s.sessionUserId = u.id
      break
    }
    case 'LOGIN': s.sessionUserId = action.userId; break
    case 'LOGOUT': s.sessionUserId = null; break
    case 'UPDATE_PROFILE': {
      const i = s.users.findIndex((u) => u.id === action.userId)
      s.users[i] = { ...s.users[i], ...action.patch }
      if (s.users[i].isWidow) s.users[i].level = kpiToLevel(s.users[i].kpi)
      break
    }
    case 'TOGGLE_FOLLOW': {
      const me = s.users.find((u) => u.id === action.meId)
      const other = s.users.find((u) => u.id === action.otherId)
      if (!me || !other) break
      if (me.following.includes(action.otherId)) {
        me.following = me.following.filter((x) => x !== action.otherId)
        other.followers = other.followers.filter((x) => x !== action.meId)
      } else {
        me.following.push(action.otherId)
        other.followers.push(action.meId)
        // kontribusi: mengajak/mempromosikan -> kpi kecil untuk member janda yang di-follow? tidak; follow bukan KPI
      }
      break
    }
    case 'ADD_EVENT': {
      s.events.unshift({ id: uid('e'), attendees: [], absensi: [], createdBy: action.createdBy, ownerId: action.ownerId, status: 'published', ...action.event })
      bumpKpi(s, action.createdBy, 50) // membuat event = kontribusi
      break
    }
    case 'UPDATE_EVENT': {
      const i = s.events.findIndex((e) => e.id === action.event.id)
      s.events[i] = { ...s.events[i], ...action.event }
      break
    }
    case 'REGISTER_ATTENDEE': {
      const e = s.events.find((ev) => ev.id === action.eventId)
      if (e && !e.attendees.includes(action.userId)) {
        e.attendees.push(action.userId)
        e.absensi.push({ name: action.name, checkedIn: false, ticketId: uid('tk') })
      }
      break
    }
    case 'CHECKIN': {
      const e = s.events.find((ev) => ev.id === action.eventId)
      const a = e?.absensi.find((x) => x.ticketId === action.ticketId)
      if (a) { a.checkedIn = true; a.at = new Date().toISOString() }
      break
    }
    case 'CREATE_GROUP': {
      s.groups.unshift({ id: uid('g'), name: action.name, level: action.level, leaderId: action.leaderId, members: [action.leaderId], messages: [] })
      bumpKpi(s, action.leaderId, 40) // membuat grup chat = kontribusi (jadi leader)
      break
    }
    case 'JOIN_GROUP': {
      const g = s.groups.find((x) => x.id === action.groupId)
      if (g && !g.members.includes(action.userId)) g.members.push(action.userId)
      break
    }
    case 'SEND_MSG': {
      const g = s.groups.find((x) => x.id === action.groupId)
      g.messages.push({ from: action.userId, text: action.text, at: new Date().toISOString() })
      break
    }
    case 'ENROLL_COURSE': {
      const c = s.courses.find((x) => x.id === action.courseId)
      if (c && !c.enrolledBy.includes(action.userId)) {
        c.enrolledBy.push(action.userId)
        bumpKpi(s, action.userId, 30) // mengikuti pelatihan/akademi
      }
      break
    }
    case 'COMPLETE_COURSE': {
      const c = s.courses.find((x) => x.id === action.courseId)
      c.progress[action.userId] = 100
      bumpKpi(s, action.userId, 20)
      break
    }
    case 'HELP_MEMBER': {
      bumpKpi(s, action.helperId, 25, action.toUserId) // membantu member lain
      break
    }
    case 'PROMOTE_NONWIDOW': {
      bumpKpi(s, action.memberId, 15)
      break
    }
    case 'SAVE_BUSINESS': {
      const u = s.users.find((x) => x.id === action.userId)
      u.business = action.business
      if (action.rab !== undefined) u.rab = action.rab
      if (action.proposal !== undefined) u.proposal = action.proposal
      break
    }
    case 'ADD_DONATION': {
      s.donations.unshift({ id: uid('d'), at: new Date().toISOString(), status: action.method === 'payment-gateway' || action.method === 'qris-auto' ? 'sukses' : 'menunggu', ...action.donation })
      const donor = s.users.find((u) => u.id === action.donation.donorId)
      if (donor && (action.donation.status === 'sukses' || action.method === 'payment-gateway')) {
        donor.donateTotal = (donor.donateTotal || 0) + action.donation.amount
      }
      break
    }
    case 'VERIFY_DONATION': {
      const dn = s.donations.find((x) => x.id === action.donationId)
      dn.status = action.status
      if (action.status === 'diverifikasi') {
        const donor = s.users.find((u) => u.id === dn.donorId)
        if (donor) donor.donateTotal = (donor.donateTotal || 0) + dn.amount
      }
      break
    }
    case 'SUBSCRIBE': {
      const u = s.users.find((x) => x.id === action.userId)
      u.subscriptionTier = action.tierId
      u.subActive = true
      break
    }
    case 'UNSUBSCRIBE': {
      const u = s.users.find((x) => x.id === action.userId)
      u.subActive = false
      break
    }
    case 'ADD_PRODUCT': {
      s.marketplace.unshift({ id: uid('m'), orders: 0, ...action.product })
      bumpKpi(s, action.product.userId, 10)
      break
    }
    case 'ADD_CONTRACT': {
      s.contracts.unshift({ id: uid('k'), status: 'berjalan', signedAt: new Date().toISOString(), ...action.contract })
      bumpKpi(s, action.contract.userId, 60)
      break
    }
    case 'UPDATE_SETTINGS': s.settings = { ...s.settings, ...action.patch }; break
    default: break
  }
  // update level otomatis dari KPI
  s.users.forEach((u) => { if (u.isWidow) u.level = kpiToLevel(u.kpi || 0) })
  return s
}

function bumpKpi(state, userId, points, helperTarget) {
  const u = state.users.find((x) => x.id === userId)
  if (u) u.kpi = (u.kpi || 0) + points
}

const Ctx = createContext(null)

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const raw = localStorage.getItem('pantijanda-store')
      if (raw) return { ...initial, ...JSON.parse(raw) }
    } catch { /* ignore */ }
    return initial
  })

  useEffect(() => {
    localStorage.setItem('pantijanda-store', JSON.stringify(state))
  }, [state])

  const value = useMemo(() => {
    const me = state.users.find((u) => u.id === state.sessionUserId) || null
    return { state, dispatch, me, isAdmin: me?.role === 'admin' }
  }, [state])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useStore harus di dalam StoreProvider')
  return ctx
}
