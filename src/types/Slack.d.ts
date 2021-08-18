export interface EventPayload<ContentInterface> {
	token: string;
	team_id: string;
	api_app_id: string;
	event: ContentInterface;
	type: string;
	/**
	 * @deprecated
	 */
	authed_teams: string[];
	event_id: string;
	event_time: number;
}

export interface EventContent {
	type: 'app_mention';
}

export interface MentionContent extends EventContent {
	type: 'app_mention';
	user: string;
	text: string;
	ts: string;
	channel: string;
	event_ts: string;
}

export interface UrlVerificationPayload {
	type: 'url_verification';
	challenge: string;
}

export type MentionEventPayload = EventPayload<MentionContent>;
