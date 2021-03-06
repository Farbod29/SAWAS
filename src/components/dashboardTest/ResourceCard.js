import React, {Component} from 'react';
import Card from "@material-ui/core/es/Card/Card";
import CardMedia from "@material-ui/core/es/CardMedia/CardMedia";
import CardContent from "@material-ui/core/es/CardContent/CardContent";
import Typography from "@material-ui/core/es/Typography/Typography";
import CardActions from "@material-ui/core/es/CardActions/CardActions";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import {parseUrlData, voteData} from "../../utils/Connection";
import NoImagePreview from '../images/no-preview.jpg';
import {GridLoader} from "react-spinners";
import StorageKeys from "../../utils/StorageKeys";


class ResourceCard extends Component {

    togglePin = () => {
        console.log("clicked on toggle");
        const pinActive1 = this.state.pinActive;
        this.setState({pinActive: !pinActive1});
    };
    onClickPlus = (event) => {
        // this.setState({
        //     count: this.state.count + 1
        // });
        this.setState({
            isVotedUp: "text-dark",
            isVotedDown: "text-black-50"
        });
        this.voteUp();
    };
    onClickMinus = (event) => {
        // this.setState({
        //     count: this.state.count - 1
        // });
        this.setState({
            isVotedUp: "text-black-50",
            isVotedDown: "text-dark"
        });
        this.voteDown()
    };

    constructor(props) {
        super(props);
        this.state = {
            previewLinkData: "",
            isUrlDataFetched: false,
            title: "",
            disc: "",
            imgURL: "",
            url: props.url,
            pinActive: true,
            count: props.totalVotes,
            userIdentification: true,


            isVotedUp: "text-black-50",
            isVotedDown: "text-black-50",
        };

    }

    parseUrl(url) {
        parseUrlData(url).then((response) => {
            console.log("return from connection function: >>> " + response);



            if (response.status === 200) {
                if (response.data.hasOwnProperty('title')){

                    this.setState({
                        previewLinkData: response.data,
                        title: response.data.title,
                        disc: response.data.excerpt,
                        imgURL: response.data.lead_image_url,
                        url: response.data.url,
                        isUrlDataFetched: true,
                    });
                }
                else {
                    this.setState({
                        previewLinkData: " -- ",
                        title: "no title",
                        disc: "no description",
                        url: "error in url",
                        isUrlDataFetched: true,
                    });
                }
            }
            else {

                this.setState({
                    previewLinkData: " -- ",
                    title: "no title",
                    disc: "no description",
                    url: "error in url",
                    isUrlDataFetched: true,
                });


            }



        });
    }

    vote(value) {
        let uid = "";
        if (localStorage.getItem(StorageKeys.USER_ID) != null)
            uid = localStorage.getItem(StorageKeys.USER_ID);
        voteData(this.props.referenceId, uid, value)
            .then((result) => {
                console.log("status1: " + result);
                if (result.status === 200) {
                    this.setState({
                        count: result.data.totalRate,
                    });

                }
                else {

                    console.log("status3: " + result);
                }
            })
            .catch(error => {
                console.log("status4: " + error);

            });
    }

    voteUp() {
        this.vote(1);
    }

    voteDown() {
        this.vote(-1);
    }


    componentDidMount() {
        this.parseUrl(this.state.url);
        if (this.props.userVote > 0) {
            this.setState({
                isVotedUp: "text-dark",
                isVotedDown: "text-black-50"
            });
        }
        else if (this.props.userVote < 0) {
            this.setState({
                isVotedUp: "text-black-50",
                isVotedDown: "text-dark"
            });
        }
    }

    render() {
        const card = {
            width: 268,
            minHeight: 268,
            // height: 400,
        };
        const media = {
            height: 0,
            paddingTop: '56.25%', // 16:9
        };

        const loader = {
            margin: 105,
        };

        let finalImageURL = this.state.imgURL;

        if (finalImageURL == null) {
            finalImageURL = NoImagePreview;
        }

        const profile_picture = {
            width: "30px",
            height: "30px",
        };
        return (
            <div className="m-2 col-centered">

                {this.state.isUrlDataFetched ? (
                    <div>
                        <Card style={card}>
                            <CardMedia
                                style={media}
                                image={finalImageURL}
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <a href={this.state.url} target="_blank">
                                    <Typography gutterBottom variant="headline" component="h5">
                                        {this.state.title}
                                    </Typography>
                                </a>
                                <label className="text-black-50 small font-weight-bold">

                                    { this.state.previewLinkData.hasOwnProperty('domain') ? (
                                        this.state.previewLinkData.domain.toUpperCase()
                                    ) : (null)}

                                    </label>
                                <Typography component="p">
                                    {this.state.disc.substr(0, 160)}
                                </Typography>
                            </CardContent>
                            {/*icons from: https://fontawesome.com/icons*/}
                            <CardActions>
                                <IconButton aria-label="Add to favorites" onClick={this.onClickPlus.bind(this)}>
                                    <i className={"fas fa-angle-double-up " + this.state.isVotedUp}/>
                                </IconButton>
                                <label> {this.state.count} </label>
                                <IconButton aria-label="Add to favorites" onClick={this.onClickMinus.bind(this)}>
                                    <i className={"fas fa-angle-double-down " + this.state.isVotedDown}/>
                                </IconButton>

                                <IconButton
                                    className="ml-auto">
                                    {/*<i className="fab fa-youtube"/>*/}
                                    <img src={this.props.userPhoto} className="rounded-circle"
                                         style={profile_picture}
                                         title={this.props.userEmail}/>
                                </IconButton>

                            </CardActions>
                        </Card>
                    </div>
                ) : (
                    <div>
                        <Card style={card}>
                            <div className="text-center" style={loader}>
                                <GridLoader
                                    color={'#2679cc'}
                                    loading={true}
                                />
                            </div>

                        </Card>
                    </div>
                )}
            </div>
        );
    }
}

export default ResourceCard;
