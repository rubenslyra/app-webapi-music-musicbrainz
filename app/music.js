// app/music.js
export class Music {
    constructor() {
        this.title = '';
        this.artist = '';
        this.year = '';
        this.track = '';
        this.picture = '';
        this.url = '';
    }

    displayInfo() {
        console.log(`Title: ${this.title} | Artist: ${this.artist} | Year: ${this.year} | Track: ${this.track} | Picture: ${this.picture} | URL: ${this.url}`);
    }
}
