async function getVideoThumbnail(postId, token) {
    try {
        const response = await fetch(`https://graph.instagram.com/${postId}?fields=thumbnail_url&access_token=${token}`);
        const data = await response.json();
        return data.thumbnail_url;
    } catch (error) {
        console.error('Error fetching video thumbnail:', error);
        return null;
    }
}

async function loadInstagramFeed(token) {
    try {
        const feedContainer = document.getElementById('instagram-feed');
        if (!feedContainer) {
            console.error('Feed container not found');
            return;
        }

        if (!token || token === 'YOUR-INSTAGRAM-TOKEN') {
            feedContainer.innerHTML = '<p>Instagram feed not configured - missing token</p>';
            return;
        }
        
        const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${token}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Instagram API Error: ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();

        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('Invalid data format received from Instagram');
        }

        const posts = await Promise.all(data.data.slice(0, 6).map(async post => {
            let imageUrl;
            
            if (post.media_type === 'VIDEO') {
                imageUrl = await getVideoThumbnail(post.id, token);
                if (!imageUrl) return ''; // Skip if we couldn't get the thumbnail
            } else {
                imageUrl = post.media_url;
            }
            
            if (!imageUrl) {
                console.error('No valid image URL found for post:', post);
                return '';
            }

            return `
                <a href="${post.permalink}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="instagram-post ${post.media_type.toLowerCase()}"
                >
                    <img src="${imageUrl}" alt="${post.caption || 'Instagram post'}" loading="lazy">
                </a>
            `;
        }));

        feedContainer.innerHTML = posts.filter(Boolean).join('');
    } catch (error) {
        console.error('Instagram feed error:', error);
        const feedContainer = document.getElementById('instagram-feed');
        if (feedContainer) {
            feedContainer.innerHTML = `
                <p>Unable to load Instagram feed</p>
                <p class="error-details">${error.message}</p>
            `;
        }
    }
}

// Initialize feed when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const feedContainer = document.getElementById('instagram-feed');
    if (!feedContainer) {
        console.error('Instagram feed container not found');
        return;
    }

    const token = feedContainer.dataset.token;
    if (token) {
        loadInstagramFeed(token);
    } else {
        console.error('No Instagram token found in data-token attribute');
        feedContainer.innerHTML = '<p>Instagram feed not configured - no token found</p>';
    }
});