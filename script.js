// ==UserScript==
// @name Wiktionary Language Prefs
// @description A script for re-ordering the languages on Wiktionary.
// @version 1.0
// @namespace https://www.mandog.com/
// @match https://*.wiktionary.org/wiki/*
// @license GNU GPLv3
// @supportURL syntaxenjoyer@tutanota.com
// ==/UserScript==

const d = document;

// your language preferences here
const langPrefs = []

const par = d.getElementsByClassName(
	'mw-parser-output');

const x = Array.from(par[0].getElementsByTagName('h2'));

const wikiLangs = x.filter(i => x.indexOf(i) > 0);

const langNames = Array.from(wikiLangs, (i) => {
	let id = i.getElementsByClassName(
		'mw-headline')[0].id;
	if (id.includes('_')) {
		let newId = id.replaceAll('_', ' ');
		return newId;
	}
	else {
		return id;
	}
});

const newOrder = {};

const frag = new DocumentFragment();

for (let i = 0; i <= (wikiLangs.length - 1); i++) {
	if (langPrefs.includes(langNames[i])) {
		let key = langNames[i];
		let r = d.createRange();
		r.setStartBefore(wikiLangs[i]);
		wikiLangs[i+ 1] && wikiLangs.length > 2 ? 
			r.setEndBefore(wikiLangs[i + 1]) :
			r.setEndAfter(par[0].lastElementChild);
		let val = r.extractContents();
		newOrder[key] = val;
	}
}

langPrefs.forEach(i => {
	if (langNames.includes(i)) {
		frag.append(newOrder[i]);
	}
});

const toc = d.getElementById('toc');

toc.parentElement == par[0] ? toc.after(frag) : d.getElementById('mf-section-0').after(frag);

const contents = d.getElementsByClassName('toclevel-1');

const contentsOrder = {};

const contentsFrag = new DocumentFragment();

const contentsLangNames = Array.from(contents, (i) =>
	i.firstElementChild.getElementsByClassName(
		'toctext')[0].innerText);

for (let i = contents.length - 1; i>=0; i--) {
	let langEntry = contentsLangNames[i];
	if (langPrefs.includes(langEntry)) {
		let key = langEntry;
		let r = d.createRange();
		r.setStartBefore(contents[i]);
		contents[i + 1] ?
			r.setEndBefore(contents[i + 1]) :
			r.setEndAfter(contents[i].lastElementChild);
		let val = r.extractContents();
		contentsOrder[key] = val;
	}
}

langPrefs.forEach(i => {
	if (contentsLangNames.includes(i)) {
		contentsFrag.append(contentsOrder[i]);
	}
});

contents[0].parentNode.insertBefore(
	contentsFrag, contents[0].parentNode.firstElementChild);
