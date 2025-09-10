import data from './data.json';

type EstekharehMap = Record<string, { trade: string }>;
const estekharehData = data as EstekharehMap;

// Create DOM structure dynamically (keeps HTML lean)
const root = document.body;
root.innerHTML = '';

const app = document.createElement('main');
app.id = 'app';
app.dir = 'rtl';
app.innerHTML = `
	<h1 class="title">استخاره</h1>
	<form id="form" autocomplete="off" novalidate>
		<label class="page-label" for="pageInput">شماره صفحه قرآن (فرد)</label>
		<div class="input-row">
			<input id="pageInput" inputmode="numeric" pattern="[0-9]*" placeholder="مثلاً 101" aria-describedby="help" />
			<button id="goBtn" type="submit">نمایش</button>
		</div>
	</form>
	<section id="pages" class="pages" aria-live="polite">
		<div class="page-pair placeholder">برای نمایش صفحات، شماره صفحه فرد را وارد کنید.</div>
	</section>
	<section id="result" class="result" aria-live="polite"></section>
`;

root.appendChild(app);

const pageInput = document.getElementById('pageInput') as HTMLInputElement;
const form = document.getElementById('form') as HTMLFormElement;
const pagesEl = document.getElementById('pages')!;
const resultEl = document.getElementById('result')!;

function normalizePage(value: string): number | null {
	if (!value) return null;
	const num = parseInt(value, 10);
	if (Number.isNaN(num)) return null;
	return num;
}

function isOdd(n: number) { return n % 2 === 1; }

function updateHash(p: number) {
	history.replaceState(null, '', `#p=${p}`);
}

function loadFromHash(): number | null {
	const m = location.hash.match(/p=(\d+)/);
	if (m) return parseInt(m[1], 10);
	return null;
}

function buildPageImages(page: number) {
	const evenPage = page + 1; // show pair (odd on right, even on left visually for RTL)
	const oddSrc = `/pages/${page}.gif`;
	const evenSrc = `/pages/${evenPage}.gif`;
	return `
		<figure class="page-pair-inner">
		<img class="page-img odd" src="${oddSrc}" alt="صفحه ${page}" onerror="this.classList.add('missing')" />
			<img class="page-img even" src="${evenSrc}" alt="صفحه ${evenPage}" onerror="this.classList.add('missing')" />
			<figcaption>صفحات ${page} و ${evenPage}</figcaption>
		</figure>
	`;
}

function showResult(page: number) {
	// Only odd allowed
	if (!isOdd(page)) {
		resultEl.innerHTML = `<div class="card error">لطفاً شماره صفحه فرد وارد کنید.</div>`;
		pagesEl.innerHTML = `<div class="page-pair placeholder">صفحه ${page} زوج است.</div>`;
		return;
	}
	const key = String(page);
	const record = estekharehData[key];
	pagesEl.innerHTML = buildPageImages(page);
	if (!record) {
		resultEl.innerHTML = `<div class="card warn">برای صفحه ${page} نتیجه‌ای در داده‌ها یافت نشد.</div>`;
		return;
	}
	resultEl.innerHTML = `<div class="card success"><h2>نتیجه صفحه ${page}</h2><p>${record.trade}</p></div>`;
}

function handleSubmit(e?: Event) {
	if (e) e.preventDefault();
	const page = normalizePage(pageInput.value);
	if (page == null) {
		resultEl.innerHTML = `<div class="card error">لطفاً شماره معتبر وارد کنید.</div>`;
		return;
	}
	updateHash(page);
	showResult(page);
	localStorage.setItem('lastPage', String(page));
}

form.addEventListener('submit', handleSubmit);
pageInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') handleSubmit(); });

// Initial
const initial = loadFromHash() ?? (() => {
	const ls = localStorage.getItem('lastPage');
	return ls ? parseInt(ls, 10) : null;
})();
if (initial) {
	pageInput.value = String(initial);
	showResult(initial);
}

// Accessibility: focus input on load
pageInput.focus();
