(() => {
	function appendButton() {
		document.querySelectorAll('#playlist').forEach(elem => {
			if (!elem.querySelector('.youtube-links-export__button')) {
				const button = document.createElement('button')
				button.style = 'padding: 10px; background: none; border: 0; text-transform: uppercase; font-size: 14px; font-weight: 500; color: rgb(96,96,96); cursor: pointer; line-height: 16px; font-family: Roboto, Arial, sans-serif;'
				button.textContent = 'Export'
				const div = document.createElement('div')
				div.className = 'youtube-links-export__button'
				div.append(button)
				elem.querySelector('#end-actions').prepend(div)
				button.addEventListener('click', e => {
					e.preventDefault()
					e.stopPropagation()
					const videoElements = [...document.querySelectorAll('#playlist a.ytd-playlist-panel-video-renderer')];
					const videoData = [];
					const seen = new Set();
					
					videoElements.forEach(a => {
						const vMatch = a.href.match(/v=([^&]+)/);
						if (!vMatch) return;
						const id = vMatch[1];
						
						if (!seen.has(id)) {
							seen.add(id);
							const container = a.closest('ytd-playlist-panel-video-renderer');
							const titleEl = container ? container.querySelector('#video-title') : null;
							let title = titleEl ? (titleEl.getAttribute('title') || titleEl.textContent).trim() : '';
							if (!title) title = a.title || 'Unknown Title';
							
							videoData.push(`${videoData.length + 1}. ${title} - https://youtu.be/${id}`);
						}
					});

					navigator.clipboard.writeText(videoData.join('\n')).then(function () {
						alert(`Copied ${videoData.length} links to clipboard`)
					}, function (err) {
						alert(`Error copying to clipboard`)
						console.error('[youtube-links-export] Error copying to clipboard', { links: videoData, err })
					})
				})
			}
		})
	}
	
	(new MutationObserver(() => {
		appendButton()
	})).observe(document, {
		childList: true,
		subtree: true,
	})
	appendButton()
})()
