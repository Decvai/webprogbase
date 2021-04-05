// import { InMemoryCache } from '@apollo/client';
// export const cache = new InMemoryCache();

import { makeVar, InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache({
	typePolicies: {
		Query: {
			fields: {
				token: {
					read() {
						return popupDisplayVar();
					},
				},
			},
		},
	},
});

export const popupDisplayVar = makeVar('none');
