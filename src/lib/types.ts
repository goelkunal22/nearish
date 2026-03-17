export type Profile = {
  id: string
  name: string
  avatar_url: string | null
  status: string | null
  updated_at: string
}

export type Circle = {
  id: string
  name: string
  invite_code: string
  created_by: string
  created_at: string
}

export type CircleMember = {
  circle_id: string
  user_id: string
  joined_at: string
  profile?: Profile
}

export type Moment = {
  id: string
  circle_id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
  profile?: Profile
}

export type Nudge = {
  id: string
  from_user: string
  to_user: string
  circle_id: string
  created_at: string
  from_profile?: Profile
}
