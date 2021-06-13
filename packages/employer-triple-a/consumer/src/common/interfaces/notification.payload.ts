export enum Channels {
    SMS = 'SMS',
    MAIL = 'MAIL'
  }
export interface NotificationPayload {
    sendTo: string;
    notificationHeader: string;
    type: string;
    notificationBody: any;
    sendChannel : Channels;
    template: string;
}