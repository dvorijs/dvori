export class FetchError extends Error {
    response: Response;

    constructor(message: string, response: Response) {
        super(message); // Pass the message to the Error constructor
        this.response = response; // Assign the response to the new property
        this.name = "FetchError"; // Optional: Set a custom error name
    }
}
