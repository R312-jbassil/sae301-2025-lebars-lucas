/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Dimension = "dimension",
	LunetteSauvegardee = "lunette_sauvegardee",
	Materiau = "materiau",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type DimensionRecord = {
	label?: string
	size?: string
	price?: number
} & BaseSystemFields

export type LunetteSauvegardeeRecord = {
	user?: RecordIdString
	config?: any
	nom?: string
	dimension?: RecordIdString
	materiau?: RecordIdString
} & BaseSystemFields

export type MateriauRecord = {
	label?: string
	price?: number
	category?: string
} & BaseSystemFields

export type UsersRecord = {
	name?: string
	avatar?: string
	panier?: any
} & AuthSystemFields

// Response types include system fields and match responses from the PocketBase API
export type DimensionResponse<Texpand = unknown> = Required<DimensionRecord> & BaseSystemFields<Texpand>
export type LunetteSauvegardeeResponse<Texpand = unknown> = Required<LunetteSauvegardeeRecord> & BaseSystemFields<Texpand>
export type MateriauResponse<Texpand = unknown> = Required<MateriauRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	dimension: DimensionRecord
	lunette_sauvegardee: LunetteSauvegardeeRecord
	materiau: MateriauRecord
	users: UsersRecord
}

export type CollectionResponses = {
	dimension: DimensionResponse
	lunette_sauvegardee: LunetteSauvegardeeResponse
	materiau: MateriauResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'dimension'): RecordService<DimensionResponse>
	collection(idOrName: 'lunette_sauvegardee'): RecordService<LunetteSauvegardeeResponse>
	collection(idOrName: 'materiau'): RecordService<MateriauResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
