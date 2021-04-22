import { InMemoryCache, makeVar } from '@apollo/client';

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				popupDisplay: {
					read() {
						return popupDisplayVar();
					},
				},
				currentUser: {
					read() {
						return currentUserVar();
					},
				},
			},
		},
	},
});

export const popupDisplayVar = makeVar('none');
export const currentUserVar = makeVar();
