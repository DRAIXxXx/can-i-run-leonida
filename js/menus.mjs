import { matchesModel } from './catalog.mjs?v=3';

const menus = [];
const useMobilePicker = matchMedia('(pointer: coarse)').matches || matchMedia('(max-width: 630px)').matches || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
for (const select of document.querySelectorAll('.field select')) {
  const label = select.closest('label');
  const name = label.firstChild.textContent.trim();
  const native = useMobilePicker || !('showPopover' in HTMLElement.prototype);
  if (native) {
    if (select.name === 'cpu' || select.name === 'gpu') addNativeSearch(select, label, name);
    continue;
  }
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'menu-trigger';
  trigger.setAttribute('aria-label', name);
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');
  const popup = document.createElement('div');
  popup.className = 'choice-menu';
  popup.id = 'choices-' + select.name;
  popup.setAttribute('popover', 'manual');
  popup.setAttribute('role', 'listbox');
  popup.setAttribute('aria-label', name);
  trigger.setAttribute('aria-controls', popup.id);
  if (select.name === 'cpu' || select.name === 'gpu') {
    const searchInput = document.createElement('input');
    searchInput.type = 'search';
    searchInput.placeholder = 'Search ' + name;
    searchInput.setAttribute('aria-label', 'Search ' + name);
    searchInput.className = 'menu-search';
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      popup.querySelectorAll('.choice-option').forEach(option => option.hidden = option.dataset.custom !== 'true' && !matchesModel(option.textContent, query));
      popup.querySelectorAll('.choice-group').forEach(group => group.hidden = Boolean(query));
    });
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        const index = buttons.findIndex(button => !button.hidden);
        if (index >= 0) focusOption(index);
      }
      if (event.key !== 'Escape' && event.key !== 'Tab') event.stopPropagation();
    });
    popup.append(searchInput);
  }
  document.body.append(popup);
  label.append(trigger);
  select.hidden = true;
  const buttons = [];
  let active = 0;
  let search = '';
  let searchTimer;

  function sync() {
    trigger.textContent = select.selectedOptions[0]?.textContent || 'Choose…';
    buttons.forEach((button, index) => {
      const chosen = index === select.selectedIndex;
      button.setAttribute('aria-selected', String(chosen));
      button.classList.toggle('is-selected', chosen);
    });
  }
  function close() {
    popup.hidePopover();
    trigger.setAttribute('aria-expanded', 'false');
  }
  function focusOption(index) {
    const visible = buttons.map((button, index) => index).filter(index => !buttons[index].hidden);
    active = visible.includes(index) ? index : visible.find(i => i >= index) ?? visible.at(-1);
    if (active === undefined) return;
    buttons.forEach((button, i) => button.tabIndex = i === active ? 0 : -1);
    buttons[active].focus({preventScroll: true});
    buttons[active].scrollIntoView({block: 'nearest'});
  }
  function position() {
    const rect = trigger.getBoundingClientRect();
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportBottom = viewportTop + (viewport?.height ?? innerHeight);
    const spaceBelow = viewportBottom - rect.bottom - 16;
    const above = spaceBelow < 220 && rect.top - viewportTop > spaceBelow;
    const height = Math.min(360, Math.max(120, above ? rect.top - 16 : spaceBelow));
    popup.style.width = Math.min(Math.max(rect.width, 280), innerWidth - 24) + 'px';
    popup.style.maxHeight = height + 'px';
    popup.style.left = Math.min(rect.left, innerWidth - parseFloat(popup.style.width) - 12) + 'px';
    popup.style.top = above ? 'auto' : rect.bottom + 8 + 'px';
    popup.style.bottom = above ? innerHeight - rect.top + 8 + 'px' : 'auto';
  }
  function open() {
    menus.forEach(menu => menu.close());
    position();
    popup.showPopover();
    trigger.setAttribute('aria-expanded', 'true');
    const searchInput = popup.querySelector('.menu-search');
    if (searchInput) {
      searchInput.value = '';
      popup.querySelectorAll('.choice-option, .choice-group').forEach(option => option.hidden = false);
      if (!matchMedia('(pointer: coarse)').matches) searchInput.focus({preventScroll: true});
    } else focusOption(select.selectedIndex);
  }
  for (const child of select.children) {
    if (child.tagName === 'OPTGROUP') {
      const heading = document.createElement('div');
      heading.className = 'choice-group';
      heading.textContent = child.label;
      heading.setAttribute('role', 'presentation');
      popup.append(heading);
    }
    const options = child.tagName === 'OPTGROUP' ? child.children : [child];
    for (const option of options) {
      const index = buttons.length;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'choice-option';
      button.setAttribute('role', 'option');
      button.textContent = option.textContent;
      if (option.value === 'custom') button.dataset.custom = 'true';
      button.tabIndex = -1;
      button.addEventListener('click', () => {
        select.selectedIndex = index;
        sync();
        close();
        trigger.focus({preventScroll: true});
        select.dispatchEvent(new Event('input', {bubbles: true}));
      });
      popup.append(button);
      buttons.push(button);
    }
  }
  trigger.addEventListener('click', () => {
    if (popup.matches(':popover-open')) close();
    else open();
  });
  trigger.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      open();
    }
  });
  popup.addEventListener('keydown', event => {
    const visible = buttons.map((button, index) => index).filter(index => !buttons[index].hidden);
    const position = visible.indexOf(active);
    const directions = {ArrowDown: visible[Math.min(visible.length - 1, position + 1)], ArrowUp: visible[Math.max(0, position - 1)], Home: visible[0], End: visible.at(-1)};
    if (event.key in directions) {
      event.preventDefault();
      focusOption(directions[event.key]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
      trigger.focus();
    } else if (event.key === 'Tab') {
      close();
      trigger.focus();
    } else if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey) {
      search += event.key.toLowerCase();
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => search = '', 700);
      const index = buttons.findIndex(button => button.textContent.toLowerCase().startsWith(search));
      if (index >= 0) focusOption(index);
    }
  });
  select.addEventListener('input', sync);
  menus.push({close, trigger, popup, position});
  sync();
}

function addNativeSearch(select, label, name) {
  // Keep the OS picker on touch devices, including Discord's embedded browser.
  // Rebuild its options on search: hidden <option> is unreliable in iOS pickers.
  const options = [...select.options].map(option => ({
    value: option.value,
    text: option.textContent,
    group: option.parentElement.tagName === 'OPTGROUP' ? option.parentElement.label : '',
  }));
  const input = document.createElement('input');
  input.type = 'search';
  input.className = 'hardware-search';
  input.placeholder = `Search ${name} (${options.length - 1} models)`;
  input.setAttribute('aria-label', `Search ${name}`);
  input.autocomplete = 'off';
  input.spellcheck = false;
  const status = document.createElement('span');
  status.className = 'hardware-search-status';
  status.setAttribute('role', 'status');
  status.hidden = true;
  label.insertBefore(input, select);
  label.append(status);
  select.setAttribute('aria-label', name);
  input.addEventListener('input', () => {
    const selected = select.value;
    const query = input.value.trim();
    const matches = options.filter(option => option.value !== 'custom' && matchesModel(option.text, query));
    const choices = [...matches];
    if (!choices.some(option => option.value === selected) && selected !== 'custom') {
      choices.unshift(options.find(option => option.value === selected));
    }
    choices.push(options.find(option => option.value === 'custom'));
    const nodes = [];
    const groups = new Map();
    for (const option of choices.filter(Boolean)) {
      const node = new Option(option.text, option.value, false, option.value === selected);
      if (!option.group) {
        nodes.push(node);
        continue;
      }
      if (!groups.has(option.group)) {
        const group = document.createElement('optgroup');
        group.label = option.group;
        groups.set(option.group, group);
        nodes.push(group);
      }
      groups.get(option.group).append(node);
    }
    select.replaceChildren(...nodes);
    status.hidden = !query;
    status.textContent = matches.length ? `${matches.length} matches · choose below` : 'No matches. Choose “Enter another model…” below.';
  });
}
document.addEventListener('pointerdown', event => {
  menus.forEach(menu => {
    if (!menu.popup.contains(event.target) && !menu.trigger.contains(event.target)) menu.close();
  });
});
function repositionOpenMenus() {
  menus.forEach(menu => {
    if (menu.popup.matches(':popover-open')) menu.position();
  });
}
addEventListener('resize', repositionOpenMenus);
window.visualViewport?.addEventListener('resize', repositionOpenMenus);
window.visualViewport?.addEventListener('scroll', repositionOpenMenus);
document.addEventListener('scroll', event => {
  if (!menus.some(menu => menu.popup.contains(event.target))) repositionOpenMenus();
}, true);
