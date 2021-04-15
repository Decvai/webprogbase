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
			},
		},
	},
});

export const popupDisplayVar = makeVar('none');
