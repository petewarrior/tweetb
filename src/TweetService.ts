namespace TweetB {
    
    export class TweetService {

        static max_id: string;

        /**
         * Get tweets which match the keyword in location.hash
         */
        public static getTweets(keyword: string): Promise<any[]> {
            let self = this;
            return new Promise<any[]>((resolve, reject) => {
                console.log(window.location.hash);
                if(typeof keyword !== "string" || keyword.trim().length === 0) { 
                    reject("keyword not set");
                    return;
                }

                let oReq = new XMLHttpRequest();

                let params: { [param_name: string]: any } = {
                    "max_id": self.max_id
                };

                let paramString = "";

                for(let i of Object.keys(params)) {
                    if(params[i] && params[i].length > 0) {
                        if(paramString.length === 0) paramString = "?";
                        paramString += i + "=" + encodeURIComponent(params[i]) + "&";
                    }
                }

                oReq.onload = (ev: Event) => {
                    let res = JSON.parse(oReq.response);
                    if(res.length > 0) {
                        let oldest = res[res.length - 1];
                        self.max_id = oldest.id_str;
                    }
                    resolve(res);
                };
                oReq.open("GET", "/api/play/" + keyword + paramString);

                oReq.send();
            });
            
        }
    }
}