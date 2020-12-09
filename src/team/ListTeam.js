import {Component} from "react";
import {
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead, TableRow,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Service from "../service/Service";
import {URL_PLAYER_AD, URL_PLAYER_UPDATE, URL_TEAM_ADD, URL_TEAM_ALL, URL_TEAM_UPDATE} from "../urls/URL";
import AddUser from "./AddPlayer";
import AddTeam from "./AddTeam";

export default class ListTeam extends Component{

    constructor(props) {
        super(props);
        this.state={
            teams:[],
            isOpened:false,
            modeEdit:false,
            editValue:{},
        }
    }

    componentDidMount() {
        try {
            Service.get(URL_TEAM_ALL)
                .then(data=>{
                    this.setState({teams:data});
                });

        }catch (e) {
            console.log("erreur",e.toString());
        }
    }

    handleAdd=(event)=>{
        this.setState({isOpened:true,editValue:{}})
    }

    dialogClose=()=>{
        this.setState({isOpened:false})
    }

    save=(p,modeEdit)=>{
        const teams=this.state.teams
        Service.update(modeEdit==false?URL_TEAM_ADD:(URL_TEAM_UPDATE+"/"+p.id),p,modeEdit?"PUT":"POST")
            .then(data=>{
                if(modeEdit==false) {
                    teams.push(p);
                }else
                {
                    const index=teams.findIndex((team)=>{
                        return team.id==p.id;
                    });
                    teams[index]=p;
                }
                this.setState({modeEdit:false,players:teams});
            })
    }

    handleEdit=(event)=>{
        const teams =this.state.teams;
        const id=event.currentTarget.getAttribute("tag");
        const u=teams.find((team)=>{
            return team.id==id;
        });
        this.setState({
            modeEdit:true,
            isOpened:true,
            editValue:u
        })
    }

    render() {
        const {teams}=this.state;
        return(
            <div>
                <div>
                    <IconButton onClick={this.handleAdd}><AddIcon /></IconButton>
                    <AddTeam editMode={this.state.modeEdit} editValue={this.state.editValue}  opened={this.state.isOpened} closed={this.dialogClose} saved={this.save}></AddTeam>
                    <br></br>
                </div>
                <Table >
                    <TableHead style={{background:" #2980B9 "}}>
                        <TableRow>
                            <TableCell><strong>Nom Equipe</strong></TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            teams.map((team)=>(
                                <TableRow key={team.id}>
                                    <TableCell>{team.name}</TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}
