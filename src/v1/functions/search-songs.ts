import axios from "axios";

export async function searchSongsFromLastFM(name: string, apiKey: string): Promise<Object[]> {
    const { data } = await axios.get(`
        http://ws.audioscrobbler.com/2.0/?method=album.search&album=${name}&api_key=${apiKey}&format=json
    `);
    console.log(data);
    return data;
}