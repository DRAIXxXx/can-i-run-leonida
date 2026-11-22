const menus = [];
for (const select of document.querySelectorAll('.field select')) {
  if (!('showPopover' in HTMLElement.prototype)) continue;
  const label = select.closest('label');
  const name = label.firstChild.textContent.trim();
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
      const query = searchInput.value.toLowerCase().trim();
      popup.querySelectorAll('.choice-option').forEach(option => option.hidden = !option.textContent.toLowerCase().includes(query));
      popup.querySelectorAll('.choice-group').forEach(group => group.hidden = Boolean(query));
    });
    searchInput.addEventListener('keydown', event => {
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
    active = Math.max(0, Math.min(buttons.length - 1, index));
    buttons.forEach((button, i) => button.tabIndex = i === active ? 0 : -1);
    buttons[active].focus({preventScroll: true});
    buttons[active].scrollIntoView({block: 'nearest'});
  }
  function position() {
    const rect = trigger.getBoundingClientRect();
    const spaceBelow = innerHeight - rect.bottom - 16;
    const above = spaceBelow < 220 && rect.top > spaceBelow;
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
      searchInput.focus();
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
      button.tabIndex = -1;
      button.addEventListener('click', () => {
        select.selectedIndex = index;
        sync();
        close();
        trigger.focus();
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
    const directions = {ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: buttons.length - 1};
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
  menus.push({close, trigger, popup});
  sync();
}
document.addEventListener('pointerdown', event => {
  menus.forEach(menu => {
    if (!menu.popup.contains(event.target) && !menu.trigger.contains(event.target)) menu.close();
  });
});
addEventListener('resize', () => menus.forEach(menu => menu.close()));
document.addEventListener('scroll', event => {
  if (!menus.some(menu => menu.popup.contains(event.target))) menus.forEach(menu => menu.close());
}, true);
