// app/music-list.js
import { Music } from './music.js';

export class MusicList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    async connectedCallback() {
        try {
            const musicData = await this.fetchMusicData();
            if (musicData) {
                this.displayMusicList(musicData);
            } else {
                console.error('Failed to fetch music data.');
            }
        } catch (error) {
            console.error('Error in connectedCallback:', error);
        }
    }

    async fetchMusicData() {
        try {
            const response = await fetch('https://musicbrainz.org/ws/2/artist/2ce02909-598b-44ef-a456-151ba0a3bd70?inc=works&fmt=json');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching music data:', error);
            return null;
        }
    }

    render() {
        const template = document.createElement('template');
        template.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: sans-serif;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          display: flex;
          margin-bottom: 10px;
        }
        span {
          display: inline-block;
          width: 100px;
        }
        img {
          height: 100px;
        }
      </style>
      <ul id="music-list"></ul>
    `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    displayMusicList(data) {
        const musicListElement = this.shadowRoot.getElementById('music-list');
        if (data && data.works) {
            data.works.forEach(work => {
                const music = this.createMusicInstance(work);
                if (music) {
                    const listItem = this.createListItem(music);
                    musicListElement.appendChild(listItem);
                }
            });
        }
    }

    createMusicInstance(work) {
        const music = new Music();

        music.title = work.title || 'N/A';
        music.artist = (work.artist && work.artist.name) || 'N/A';
        music.year = work.date || 'N/A';
        music.track = work.number || 'N/A';
        music.picture = this.extractPictureUrl(work) || 'N/A';
        music.url = this.extractMusicUrl(work) || 'N/A';

        return music;
    }

    createListItem(music) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
      <div>
        <strong>Title:</strong> ${music.title} |
        <strong>Artist:</strong> ${music.artist} |
        <strong>Year:</strong> ${music.year} |
        <strong>Track:</strong> ${music.track} |
        <strong>Picture:</strong> ${music.picture} |
        <strong>URL:</strong> ${music.url}
      </div>
    `;
        return listItem;
    }

    extractPictureUrl(work) {
        const relations = work.relations || [];
        const imageRelation = relations.find(relation => relation.type === 'image');
        return imageRelation ? imageRelation.url.resource : null;
    }

    extractMusicUrl(work) {
        const relations = work.relations || [];
        const audioRelation = relations.find(relation => relation.type === 'audio');
        return audioRelation ? audioRelation.url.resource : null;
    }
}

customElements.define('music-list', MusicList);
