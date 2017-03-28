/// <reference path="../../typings/index.d.ts" />

import * as express from "express";
import * as path from "path";
import * as Twit from "twit";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;
    public T: Twit;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // create expressjs application
        this.app = express();

        this.T = new Twit({
            consumer_key: process.env.TWITTER_CONSUMER_KEY,
            consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
            access_token: process.env.TWITTER_ACCESS_TOKEN,
            access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
        });

        this.app.set("port", process.env.PORT || 3000);
        this.app.set("view engine", "pug");

        this.app.use(express.static(path.join(__dirname, "../../public")));
        
        this.app.get("/", (req, res) => res.render("index"));

        // configure application
        // this.config();

        // add routes
        this.routes();

        // add api
        this.api();

        this.app.listen(this.app.get("port"), () => {
            console.log("\nExpress server up and running at http://localhost:%s.\n", this.app.get("port"));
        });
    }

    protected search(keyword: string, limit: number = 10, max_id?: string): Promise<any> {

        return this.T.get("search/tweets", { q: keyword, count: limit, lang: "en", max_id: max_id }, (err, data, response) => {
            
        });
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        let router = express.Router();

        router.get("/play/:keyword", (req: express.Request, res: express.Response) => {
            let keyword = req.params["keyword"];
            let max_id = req.query["max_id"];
            if (!keyword) res.send(400);

            this.search(keyword, 10, max_id).then((result) => {
                res.contentType('application/json').send(result.data.statuses);
            }, (error: Error) => {
                res.send(error.message);
            });
        });

        router.get("/", (req: express.Request, res: express.Response) => {
            res.send('API root');
        });

        this.app.use('/api', router);
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        // empty for now
    }

    /**
     * Create router
     *
     * @class Server
     * @method api
     */
    public routes() {

    }
}