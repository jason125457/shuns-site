/** Replaces each click-to-play YouTube link with the privacy-enhanced player when clicked. */
export function enhanceYouTubeFacades(root: ParentNode = document): void {
  root.querySelectorAll<HTMLAnchorElement>('a[data-youtube-id]').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Let modified clicks (new tab, etc.) open YouTube as usual.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();

      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${link.dataset.youtubeId}?autoplay=1&rel=0`;
      iframe.title = link.dataset.youtubeTitle ?? 'YouTube';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      link.replaceWith(iframe);
      iframe.focus();
    });
  });
}
