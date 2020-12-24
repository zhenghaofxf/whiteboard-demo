import * as React from "react";
import {RouteComponentProps} from "react-router";
import "./CreatePage.less";
import logo from "./assets/image/logo.svg";
import {Button, Input, Checkbox} from "antd";
import {Link} from "react-router-dom";
import { Identity } from "./IndexPage";
import {LocalStorageRoomDataType} from "./HistoryPage";
import moment from "moment";
import { netlessWhiteboardApi } from "./apiMiddleware";
import { withTranslation, WithTranslation } from 'react-i18next';
import { CheckboxChangeEvent } from "antd/lib/checkbox";

export type CreatePageStates = {
    roomName: string;
    value: boolean;
    enableH5: boolean;
};

class CreatePage extends React.Component<RouteComponentProps & WithTranslation, CreatePageStates> {
    public constructor(props: RouteComponentProps & WithTranslation) {
        super(props);
        this.state = {
            roomName: "",
            value: false,
            enableH5: false,
        };
    }

    private createRoomAndGetUuid = async (room: string, limit: number): Promise<string | null>  => {
        const res = await netlessWhiteboardApi.room.createRoomApi(room, limit);
        if (res.uuid) {
            return res.uuid;
        } else {
            return null;
        }
    }

    private handleEnableH5 = (e: CheckboxChangeEvent) => {
        const checked = e.target.checked;
        this.setState({ enableH5: checked });
    }


    private handleJoin = async (): Promise<void> => {
        const userId = `${Math.floor(Math.random() * 100000)}`;
        const uuid = await this.createRoomAndGetUuid(this.state.roomName, 0);
        if (uuid) {
            this.setRoomList(uuid, this.state.roomName, userId);
            let url = `/whiteboard/${Identity.creator}/${uuid}/${userId}`;
            if (this.state.enableH5) {
                url = url + `?h5=true`;
            }
            this.props.history.push(url);
        }
    }

    public setRoomList = (uuid: string, roomName: string, userId: string): void => {
        const rooms = localStorage.getItem("rooms");
        const timestamp = moment(new Date()).format("lll");
        if (rooms) {
            const roomArray: LocalStorageRoomDataType[] = JSON.parse(rooms);
            const room = roomArray.find(data => data.uuid === uuid);
            if (!room) {
                localStorage.setItem(
                    "rooms",
                    JSON.stringify([
                        {
                            uuid: uuid,
                            time: timestamp,
                            identity: Identity.creator,
                            roomName: roomName,
                            userId: userId,
                        },
                        ...roomArray,
                    ]),
                );
            } else {
                const newRoomArray = roomArray.filter(data => data.uuid !== uuid);
                localStorage.setItem(
                    "rooms",
                    JSON.stringify([
                        {
                            uuid: uuid,
                            time: timestamp,
                            identity: Identity.creator,
                            roomName: roomName,
                            userId: userId,
                        },
                        ...newRoomArray,
                    ]),
                );
            }
        } else {
            localStorage.setItem(
                "rooms",
                JSON.stringify([
                    {
                        uuid: uuid,
                        time: timestamp,
                        identity: Identity.creator,
                        roomName: roomName,
                        userId: userId,
                    },
                ]),
            );
        }
    };

    public render(): React.ReactNode {
        const { t } = this.props
        const {roomName} = this.state;
        return (
            <div className="page-index-box">
                <div className="page-index-mid-box">
                    <div className="page-index-logo-box">
                        <img src={logo} alt={"logo"}/>
                        <span>
                                0.0.1
                        </span>
                    </div>
                    <div className="page-index-form-box">
                        <Input placeholder={t('setRoomName')}
                               value={roomName}
                               style={{marginBottom: 18}}
                               onChange={evt => this.setState({roomName: evt.target.value})}
                               className="page-create-input-box"
                               size={"large"}/>
                        <div style={{marginBottom: 18, width: "100%", marginLeft: 95 }}>
                            <Checkbox style={{marginRight: 5}} onChange={this.handleEnableH5} /> {t("enableH5Demo")}
                        </div>
       
                        <div className="page-index-btn-box">
                            <Link to={"/"}>
                                <Button className="page-index-btn"
                                        size={"large"}>
                                    {t('backHomePage')}
                                </Button>
                            </Link>
                            <Button className="page-index-btn"
                                    disabled={roomName === ""}
                                    size={"large"}
                                    onClick={this.handleJoin}
                                    type={"primary"}>
                                {t('createRoom')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(CreatePage)