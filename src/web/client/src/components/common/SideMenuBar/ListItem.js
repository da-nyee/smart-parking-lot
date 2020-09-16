import React from 'react';
import MUListItemText from '@material-ui/core/ListItemText';
import MUListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';
import List from './List';
import palette from '../../../lib/styles/palette';
import {Link} from 'react-router-dom';

const useStyles = makeStyles((theme) => (
    {
        listItemText:{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'2rem',
            color:'white',
            padding:8,
            borderBottom:'solid black 1px',
        },
        subListItemText:{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            fontSize:'1.5rem',
            color:'white',
            padding:8,
            background:`${palette.gray[4]}`,
            "&:hover":{
                background:`${palette.gray[6]}`
            }
        },
        listItem:{
            display:'block',
            "&:hover":{
                background:`${palette.gray[7]}`
            }
        },
        listItemRoot:{
            padding:0,
        },
        listItemTextRoot:{
            margin:0,
        }
    }
));

const ListItem=({menu, handleHover, handleLeave})=>{
    const classes=useStyles();

    return(
        <MUListItem 
            divider={true}
            classes={{
                root:classes.listItemRoot,
            }}
            disableGutters={true}
            className={classes.listItem}
            button 
            key={menu.id} 
            component={Link}
            to={menu.link}
            onMouseLeave={()=>{if(menu.subs)handleLeave(menu.id)}}>
            <MUListItemText
                    primary={menu.id}
                    classes={{
                        primary:(menu.sub?classes.subListItemText:classes.listItemText),
                        root:classes.listItemTextRoot,
                    }}
                    onMouseEnter={()=>{if(menu.subs)handleHover(menu.id)}}/>
            {menu.open&&<List menus={menu.subs}/>}
        </MUListItem>
    );
};

export default ListItem;
