(function() {
  'use strict';

  const responseHandlers = {
      'https://chat.openai.com/backend-api/models': async function(response) {
          const body = await response.clone().json();
          body.categories.push({
              "category": "gpt_4",
              "human_category_name": "GPT-4 Mobile",
              "subscription_level": "plus",
              "default_model": "gpt-4-mobile"
          });

          return new Response(JSON.stringify(body), {
              status: response.status,
              statusText: response.statusText,
              headers: {'Content-Type': 'application/json'}
          });
      },

      'https://chat.openai.com/backend-api/moderations': async function(response) {
          const body = await response.clone().json();
          body.flagged = false;
          body.blocked = false;

          return new Response(JSON.stringify(body), {
              status: response.status,
              statusText: response.statusText,
              headers: {'Content-Type': 'application/json'}
          });
      }
  };

  window.fetch = new Proxy(window.fetch, {
      apply: async function(target, thisArg, argumentsList) {
          const response = await Reflect.apply(...arguments);
          for (let key in responseHandlers) {
              if (argumentsList[0].includes(key)) {
                  return responseHandlers[key](response);
              }
          }
          return response;
      }
  });
})();
