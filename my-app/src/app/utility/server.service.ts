import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { UserCredentials } from '../models/auth/user-credentials.model'
import { Response } from '../models/response.model';
import { GroupInfo } from '../models/group/group-info.model';
import { CookieService } from 'ngx-cookie-service';
import { GetMessage } from '../models/messages/get-message.model';
import { SendMessage } from '../models/messages/send-message.model';
import { GetNewMessages } from '../models/messages/get-new-messages.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';



@Injectable()

export class Server {
    private ServerUrl = "http://kufrko-rest-api.azurewebsites.net/api/";
    //private ServerUrl = "http://localhost:49608/api/";
    constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {
    }
    LogIn(email: string, password: string): Promise<Response> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        let credentials: UserCredentials = new UserCredentials();
        credentials.Email = email;
        credentials.Password = password;

        return this.http.post<Response>(this.ServerUrl + "Auth/Login", JSON.stringify(credentials), httpOptions)
            .toPromise()
            .then((response) => response);
    }
    Register(email: string, password: string, username: string): Promise<Response> {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        }
        let credentials: UserCredentials = new UserCredentials();
        credentials.Email = email;
        credentials.Password = password;
        credentials.Name = username;

        return this.http.post<Response>(this.ServerUrl + "Auth/Register", JSON.stringify(credentials), httpOptions)
            .toPromise()
            .then((response) => response);
    }
    /***GROUPS***/
    GetGroups(): Promise<Response> {
        let httpOptions = this.getHeaders();
        return this.http.get<Response>(this.ServerUrl + "Group/GetAll", { headers: httpOptions })
            .toPromise()
            .then((response) => {
                return response;
            });
    }
    /***MESSAGES***/
    GetNewMessages(groupIds: number[], lastId: number) {
        let httpOptions = this.getHeaders();
        let newMessages: GetNewMessages = new GetNewMessages(lastId, groupIds)
        return this.http.post<Response>(this.ServerUrl + "Message/GetNewMessages", JSON.stringify(newMessages), { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }    
    GetNewMessagesByDate(lastUpdated: Date) {
        let httpOptions = this.getHeaders();
        let params = new HttpParams().set("LastUpdated", lastUpdated.toISOString());
        return this.http.get<Response>(this.ServerUrl + "Message/GetNewMessagesByDate", { headers: httpOptions, params: params })
            .toPromise();
    }
    GetMessages(groupId: number, amount: number, startId: number = 0): Promise<Response> {
        let httpOptions = this.getHeaders();
        let getMessage = new GetMessage(groupId, startId, amount)
        return this.http.post<Response>(this.ServerUrl + "Message/GetMessages", JSON.stringify(getMessage), { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }
    SendMessage(Id_Attachment: number[], Id_Group: number, MsgText: string): Promise<Response> {
        let message = new SendMessage(Id_Attachment, Id_Group, MsgText);
        let httpOptions = this.getHeaders();
        return this.http.post<Response>(this.ServerUrl + "Message/SendMessage", JSON.stringify(message), { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }
    SetMessageStauts(IdMessage: number, Seen: boolean) {
        let params = new HttpParams().set("Seen", String(Seen)).set("Id_Message", IdMessage.toString());
        let headers = this.getHeaders();
        return this.http.post<Response>(this.ServerUrl + "Message/SetMessageState", null, { headers: headers, params: params })
            .toPromise()
    }
    /***FRIENDS***/
    GetExistingFriends(): Promise<Response> {
        let httpOptions = this.getHeaders();
        return this.http.get<Response>(this.ServerUrl + "Friend/LoadExistingFriends", { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }
    GetPendingFriends(): Promise<Response> {
        let httpOptions = this.getHeaders();
        return this.http.get<Response>(this.ServerUrl + "Friend/LoadPendingToMe", { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }

    SendFriendRequest(RecieverId: number): Promise<Response> {
        let headers = this.getHeaders();

        return this.http.post<Response>(this.ServerUrl + "Friend/CreateFriendRequest", { User_id: RecieverId }, { headers: headers })
            .toPromise()
            .then((response) => response);
    }
    SearchFriend(name: string): Observable<Response> {
        let params = new HttpParams().set("fulltext", name);
        let headers = this.getHeaders();

        return this.http.get<Response>(this.ServerUrl + "Friend/SearchNewFriends", { headers: headers, params: params });
    }
    AcceptFriend(idFriend: number): Promise<Response> {
        let headers = this.getHeaders();
        return this.http.patch<Response>(this.ServerUrl + "Friend/AcceptFriend", { User_id: idFriend }, { headers: headers }).toPromise();
    }
    DenyFriend(idFriend: number): Promise<Response> {

        let headers = this.getHeaders();
        return this.http.patch<Response>(this.ServerUrl + "Friend/RemoveFriend", { User_id: idFriend }, { headers: headers }).toPromise();
    }
    BlockFriend(idFriend: number): Promise<Response> {

        let headers = this.getHeaders();
        return this.http.patch<Response>(this.ServerUrl + "Friend/BlockFriend", { User_id: idFriend }, { headers: headers }).toPromise();
    }
    /***SELF***/
    GetSelf(): Promise<Response> {
        let httpOptions = this.getHeaders();
        return this.http.get<Response>(this.ServerUrl + "Account/GetSelf", { headers: httpOptions })
            .toPromise()
            .then((response) => response);
    }
    UpdateUsername(username: string): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("username", username)
        return this.http.get<Response>(this.ServerUrl + "Account/UpdateUsername", { headers: headers, params: params })
            .toPromise()
    }
    UpdatePassword(password: string): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("password", password)
        return this.http.get<Response>(this.ServerUrl + "Account/EditPassword", { headers: headers, params: params })
            .toPromise()
    }
    UpdateProfilePicture(idProfilePicture: number): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("Id_Attachment", idProfilePicture.toString())
        return this.http.get<Response>(this.ServerUrl + "Account/EditProfilePicture", { headers: headers, params: params })
            .toPromise()
    }
    UpdateVisibility(Visibility: number): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("visibility", Visibility.toString())
        return this.http.get<Response>(this.ServerUrl + "Account/UpdateVisibility", { headers: headers, params: params })
            .toPromise()
    }
    DeleteAccount() {
        let headers = this.getHeaders();
        return this.http.get<Response>(this.ServerUrl + "Account/DeleteSelf", { headers: headers })
            .toPromise()
    }
    /***FILE***/
    AttachmentExists(hash: string): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("hash", hash);
        return this.http.get<Response>(this.ServerUrl + "File/AttachmentExists", { headers: headers, params: params })
            .toPromise();
    }
    UploadAttachment(base64: string): Promise<Response> {
        let headers = this.getHeaders();
        return this.http.post<Response>(this.ServerUrl + "File/SaveAttachment", JSON.stringify({ attachment: base64 }), { headers: headers })
            .toPromise();
    }
    DownloadAttachment(Id_Attachment: number): Promise<Response> {
        let headers = this.getHeaders();
        let params = new HttpParams().set("IdAttachment", Id_Attachment.toString())
        return this.http.get<Response>(this.ServerUrl + "File/SaveAttachment", { headers: headers, params: params })
            .toPromise();
    }

    LogOut() {
        this.cookieService.delete("token", "/");
        this.router.navigate(["/login"]);
    }
    private getHeaders() {
        let token = this.cookieService.get('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Token': token
        })
    }
}