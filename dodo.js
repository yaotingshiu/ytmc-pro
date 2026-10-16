// Moving Company for YouTube™: Dodo Payments settings shared by the plans page and the manage page.
// DODO_MODE 'test' uses the test-mode products (test cards only); switch it to 'live' once the Dodo account is verified.
// ?dodo=live or ?dodo=test overrides it for one visit.
(function () {
  const SETS = {
    live: { business: 'bus_0Nprvs7O5y9gKKbGFYQBG', m1: 'pdt_0NpsAS1jmgiers4MhGGey', y1: 'pdt_0NpsAAu9ccoXG7poLPa8f', life: 'pdt_0Nps9rnrtxTrbNng9BzZJ' },
    test: { business: 'bus_0Nprvs7O5y9gKKbGFYQBG', m1: 'pdt_0NpsAyPIs8oc1X0D8PkuJ', y1: 'pdt_0NpsJEDpfNXTkZV0pvWQl', life: 'pdt_0NpsJXX6iWyWTRSgEuqat' }
  };
  const DODO_MODE = 'test';
  const q = new URLSearchParams(location.search).get('dodo');
  const mode = q === 'live' || q === 'test' ? q : DODO_MODE;
  const d = { ...SETS[mode], test: mode === 'test', mode };
  d.portal = d.business ? `https://${d.test ? 'test.' : ''}customer.dodopayments.com/login/${d.business}` : 'mailto:speed132454@gmail.com';
  window.YTMC_DODO = d;
  window.YTMC_DODO_MODE = mode;
  try { sessionStorage.setItem('ytmc_dodo_mode', mode); } catch (e) { /* ignore */ }   // for paid.html in this tab
})();
