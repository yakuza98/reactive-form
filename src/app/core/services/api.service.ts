import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) {}
  post(url: string, data: any) {
    return this.http.post(url, data)
  }
}
