import React, {Component} from 'react';
import {Tab, Tabs, Grid, Cell, IconButton, CardText,
        FABButton, Icon} from 'react-mdl';
import {Modal,InputGroup,FormControl,Dropdown, DropdownButton, Card} from 'react-bootstrap';
import fire from '../config/firebaseConfig';
import { Dropdown as Drop, Button, Image, Label  } from 'semantic-ui-react'
import './App.css'
import BackgroundParticles from './BackgroundParticles';


export default class ProjDashBoard extends Component {
    
    state = {activeTab:0,names:[], projects:[], modalShow:false, 
    title:"", description:"", gitLink:"", curUid:"", selectLab:"Choose the category",guide:'',users:'', heightCtr:0,
    loading:true, developers:[], teammem:{}}
    

    handleSubmit = (developer) => {
        this.setState({
            curUid: developer
        },()=>{
            var path = "/project/" + this.state.curUid
            this.props.history.push(path)
        })
    }

    imageover(imgCtr){

      document.getElementById("descp"+imgCtr).style.opacity=1;
      document.getElementById("img"+imgCtr).style.transform = "scale(1.05)";
      document.getElementById("descp"+imgCtr).style.transform = "scale(1.05)";
      //document.getElementById("card"+imgCtr).style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2), 0 8px 20px 0 rgba(0,0,0,0.2)'
    }

    imageOut(imgCtr){
      document.getElementById("descp"+imgCtr).style.opacity=0;
      document.getElementById("img"+imgCtr).style.transform = "scale(1)";
      document.getElementById("descp"+imgCtr).style.transform = "scale(1)";
      //document.getElementById("card"+imgCtr).style.boxShadow = ''
    }


    getKeyfromVal(users, val)
    {
        console.log(users)
        return Object.keys(users).find(key => users[key] === val);
    }

    componentDidMount()
    {
        if(fire.auth().currentUser !== null)
        console.log(fire.auth().currentUser.uid)
        var projects = []
        var aiMLProjects = []
        var projCtr = 0;
        var aimlctr = 0;
        var heightCtr = 0;
        fire.database().ref('projects/').on('value',(snap)=>{
            fire.database().ref('users/').on('value',(users)=>{
            var project = []
            var aimlProj = []
            var names = []
            var developers = []
            var teammem = {}
             users.forEach(child=>{
                names.push({key: child.val().usn, text: child.val().fullName, value: child.key })
                developers.push(child.key)
                teammem[child.key] = child.val().fullName
            })

            

            Object.entries(snap.val()).map(([keyproj, proj]) => {

                console.log("Entries", keyproj, proj)
                if(projCtr%3==0)
                {
                    if(projCtr!=0)
                        {
                            //console.log(projCtr)
                            projects.push(<Grid>
                                {project}
                            </Grid>)
                        project = []
                        }
                    
                }

                if(aimlctr%3==0)
                {
                    if(aimlctr!=0)
                        {
                            //console.log(projCtr)

                            aiMLProjects.push(<Grid>
                                {aimlProj}
                            </Grid>)
                            heightCtr = heightCtr + 1;
                        aimlProj = []
                        }
                    
                }

                //
                var images = ["https://images.unsplash.com/photo-1551169795-9e8eb7adb400?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1052&q=80",
                            "https://images.unsplash.com/photo-1517167685284-96a27681ad75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80",
                        "https://images.unsplash.com/photo-1551419762-4a3d998f6292?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80",
                    "https://images.unsplash.com/photo-1552688419-9949ce9dd731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"]
                
                var member = []
                var rand = Math.floor(Math.random() * (4 - 0))
                proj.developers.split(",").forEach(uid=>{
                    member.push(teammem[uid])
                })
                member = member.join(", ")
            
                var background = "url("
                background = background + images[rand] + ")"
                console.log(background)
                project.push(<Cell col={4} >
                  
                  <Card id={`card${projCtr}`} style={{ width: '300px',height:'300px', borderRadius:'20px',boxShadow:'0 4px 8px 0 rgba(0,0,0,0.2), 0 8px 20px 0 rgba(0,0,0,0.2)' }} >
                    <div style={{display: 'flex',flexDirection:'column', borderTopLeftRadius:'20px', borderTopRightRadius:'20px', width:'100%', height:'15%', backgroundColor:'#ffe082', alignItems:'center', justifyContent:'center', justifyItems:'center'}}> 
                      <div>
                        <Card.Text style={{flex:1, height:'100%',fontFamily:'MONTSERRAT-SEMIBOLD',}}>{proj.title}</Card.Text>
                      </div>
                    </div>
                    <div style={{width:'100%',height:'70%'}}> 
                      <img id={`img${projCtr}`} className="img-hover-zoom" src={images[rand]} />
                      <div id={`descp${projCtr}`} style={{paddingLeft:'20px', paddingRight:'20px'}}
                      className="description" onMouseOver={this.imageover.bind(this, `${projCtr}`)} 
                      onMouseOut={this.imageOut.bind(this, `${projCtr}`)} onClick={() => this.props.history.push(`/project/${keyproj}`)}>
                      <p style={{fontFamily:'MONTSERRAT-SEMIBOLD'}} >{this.maxLength(proj.description, 100)}</p>
                      <br/><br/>
                      <p style={{fontFamily:'MONTSERRAT-SEMIBOLD', color:"#FEDA6A"}} > Team : {member}</p>
                    </div>
                    </div>
                    
                    <div style={{display: 'flex',borderBottomLeftRadius:'20px', borderBottomRightRadius:'20px', width:'100%', height:'15%', backgroundColor:'#FEDA6A', alignItems:'center', justifyContent:'center', justifyItems:'center'}}>
                    <div>
                        <Card.Text style={{flex:1, height:'100%', fontFamily:'MONTSERRAT-SEMIBOLD'}}>{proj.Lab}</Card.Text>
                      </div>
                    </div>
                  </Card>
                    
                    </Cell>)
                projCtr = projCtr +1
                console.log(proj.Lab) 
                if(typeof proj.Lab !== undefined && proj.Lab!= null)
                {
                    console.log("asdasdasd", typeof proj.Lab)
                if(proj.Lab == "AI and ML Innovation Lab")
            {
             aimlProj.push(<Cell col={4} >
               <Card style={{ width: '18rem' }}>
                    <Card.Img variant="top" src={background} />
                    <Card.Body>
                      <Card.Title>Card Title</Card.Title>
                      <Card.Text>
                        Some quick example text to build on the card title and make up the bulk of
                        the card's content.
                      </Card.Text>
                      <Button variant="primary">Go somewhere</Button>
                    </Card.Body>
                  </Card></Cell>
                )
                aimlctr = aimlctr + 1   
            }
        }
            })

            aiMLProjects.push(<Grid>{aimlProj}</Grid>)
            projects.push(<Grid>{project}</Grid>)
            console.log(projects)

           




            console.log('names',names)
            this.setState({projects:projects, aiMLProjects: aiMLProjects, heightCtr : heightCtr, names:names, loading:false, teammem:teammem});
            })
        });
    }


    

    maxLength(str, maxlen=40)
    {   
        if(str.length>maxlen)
        {
            str = str.slice(0,maxlen);
            str = str+" ...."
            return str;
        }
        else
            return str
    }

    submitFirebase() {
        if(this.state.title!="" && this.state.description!="" && this.state.gitLink!="" && this.state.selectLab!="" &&
        this.state.guide!="" && this.state.names.length != 0)
        {
            fire.database().ref(`projects/`+ (99999999999-Math.floor(Date.now() / 1000))).set({
                title:this.state.title,
                description:this.state.description,
                gitLink: this.state.gitLink,
                developers: this.state.developers.join(","),
                Lab: this.state.selectLab,
                guide: this.state.guide
            }, ()=>{
                this.state.names.forEach(uid=>{
                    console.log("UIDSSS", uid)
                    fire.database().ref(`users/${uid.value}/projects/${99999999999-Math.floor(Date.now() / 1000)}`).set({
                        title:this.state.title,
                        description:this.state.description,
                        gitLink: this.state.gitLink,
                        developers: this.state.developers.join(","),
                        Lab: this.state.selectLab,
                        guide: this.state.guide
                    }, this.onHide.bind(this))
                })
            })
        }
        else
        {
            alert("All the fields must be filled")
        }
        
    }

    toggleCategories(){
        if(this.state.activeTab===0)
        {
           if(this.state.loading)
            return <div class="lds-css ng-scope" style={{marginLeft:'200px', marginTop:'200px'}}>
                <div style={{width:'100%',height:'100%'}} class="lds-double-ring">
                    <div></div><div></div></div>
            </div>

            else
                return this.state.projects
            
        }

        else if(this.state.activeTab===1)
        {
            return(
                <div>
                    <h1>All the department projects will be displayed here</h1>
                </div>
            )
        }

        else
        {
            return <div>{this.state.aiMLProjects}</div>
        }
    }   

    addProjectModal()
    {
        
        return  <Modal
                    style={{background:'#27272750'}}
                    show={this.state.modalShow}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header style={{background:'#272727'}}>
                    <Modal.Title id="contained-modal-title-vcenter" style={{color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>
                        Add Your Project
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body >

                        <div style={{display: 'flex',flexDirection:'column', alignItems:'center'}}>


                          <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                    <InputGroup className="mb-3" style={{width:'680px', marginRight:'50px'}}>
                        <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1" style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl
                        onChange={title => this.setState({title:title.target.value})}
                        style={{fontFamily:'MONTSERRAT-SEMIBOLD'}}
                        aria-label="Title"
                        aria-describedby="basic-addon1"
                        />
                    </InputGroup>


                    
                    <InputGroup className="mb-3">
                            <InputGroup.Prepend>
                                        <InputGroup.Text style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>Category</InputGroup.Text>
                            </InputGroup.Prepend>

                            <InputGroup.Prepend>
                                <InputGroup.Text style={{width:'250px', justifyContent:'center', background:'#fff', color:'#272727', fontFamily:'MONTSERRAT-SEMIBOLD'}}>{this.state.selectLab}</InputGroup.Text>
                            </InputGroup.Prepend>

                            <DropdownButton
                            as={InputGroup.Prepend}
                            variant="outline-light"
                            title=""
                            id="input-group-dropdown-1"
                            onSelect={(evt)=>{
                                this.setState({selectLab:evt})
                            }}
                            style={{background:'#6F69FF'}}
                            >
                            <Dropdown.Item eventKey="AI and ML Innovation Lab">AI & ML Lab</Dropdown.Item>
                            <Dropdown.Item eventKey="Mobile Innovation Lab">MIL</Dropdown.Item>
                            <Dropdown.Item eventKey="SocioTech Innovation Lab">SIL</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item eventKey="General">General</Dropdown.Item>
                            </DropdownButton>
                            
                        </InputGroup>
                        </div>


                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>Description</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={desc => this.setState({description:desc.target.value})} 
                                    style={{fontFamily:'MONTSERRAT-SEMIBOLD'}}
                                    as="textarea" aria-label="With textarea" 
                                    />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon3" style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>
                            Github Link
                        </InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl onChange={git => this.setState({gitLink:git.target.value})} 
                                    style={{fontFamily:'MONTSERRAT-SEMIBOLD'}}
                                    id="basic-url" aria-describedby="basic-addon3" />
                    </InputGroup>
                    

                    <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                    <InputGroup className="mb-3" style={{width:'400px', marginRight:'50px'}}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon3" style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>
                            Team
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Drop
                      placeholder='Team Members'
                      fluid
                      multiple
                      search
                      selection
                      options={this.state.names}
                      onChange = {(e, { name, value })=>{this.setState({developers:value})}}
                      style={{width:'300px',fontFamily:'MONTSERRAT-SEMIBOLD'}}
                    />
                    </InputGroup>

                    <InputGroup className="mb-3" style={{width:'300px'}}>
                    <InputGroup.Prepend>
                        <InputGroup.Text id="basic-addon3" style={{width:'100px', justifyContent:'center', background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>
                            Guide
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                        onChange={guide => this.setState({guide:guide.target.value})}
                        style={{fontFamily:'MONTSERRAT-SEMIBOLD', height:'40px'}}
                        aria-label="guide"
                        aria-describedby="basic-addon1"
                        placeholder = "Individual project - None"
                        />
                    </InputGroup>
                    
                            
                    </div>
                    <div>
                    <Button.Group>
                    <Button positive onClick={this.submitFirebase.bind(this)} 
                    style={{background:'#feda6a', color:'#272727', fontFamily:'MONTSERRAT-SEMIBOLD'}} >Submit</Button>
                    <Button.Or />
                    <Button  onClick={this.onHide.bind(this)} 
                    style={{background:'#6F69FF', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}} >Cancel</Button>
                    </Button.Group> 
                    </div>
                    </div>
                    </Modal.Body>
                    </Modal>
    }


    onDrop= (files)=> {
        console.log(files);
    }


    onHide(){
        this.setState({ modalShow: false });
    }

    fabButton()
    {
      if(fire.auth().currentUser!=null)
      {
        return <FABButton colored ripple style={{margin: '0px',
        top: 'auto',
        right: '20px',
        bottom: '20px',
        left: 'auto',
        position: 'fixed'}}
        
        onClick={()=> this.setState({modalShow:true })}>
<Icon name="add" />
</FABButton>
      }
      else
      {
        return <div></div>
      }
    }

    backgroundParticles()
    {
        return(
            <BackgroundParticles />
            
        )
    }
    render()
    {   console.log(this.state.teammem)
        return(
            <div>
                {this.backgroundParticles()}
                <div style={{position:'relative'}}>
                <Tabs activeTab={this.state.activeTab} style={{background:"#feda6a", position:'fixed', width:'100%', zIndex:100}} onChange={ (tabId)=> {this.setState({ activeTab:tabId }) } } ripple>
                    <Tab>All Projects</Tab>
                    <Tab>Department Projects</Tab>
                    <Tab>AIML Projects</Tab>
                </Tabs>
                </div>

                {this.addProjectModal()}

                <div>
                  {this.fabButton()}
                </div>

                <div style={{display:'flex', flexDirection:'row'}}>
                <div style={{position:'fixed',width:'25%', height:'100%', background:'#272727', overflow:'hidden', top:'17.7%'}}> 
                        <div className="mainTitle" style={{justifyContent:'center',alignItems:'center'}}> 
                        <p style={{fontSize:'20px', color:'#fff', fontFamily:'MONTSERRAT-SEMIBOLD'}}>Project Dashboard</p>
                        </div>

                        <div style={{marginLeft:'50px',marginTop:'15px',alignItems:'center'}}> 
                        <p style={{fontSize:'16px', color:'#fafafa', fontFamily:'MONTSERRAT-SEMIBOLD'}}>Labs</p>
                        </div>
                        

                        <div style={{marginTop:'10px'}} >

                            <div className="subgroups" style={{padding:'10px', alignItems:'center'}}> 
                            <div>
                                <img src={require('../resources/brain.png')} style={{marginLeft:'50px',width:'30px', height:'30px'}}/>
                            </div>
                            <p style={{marginLeft:'17px', fontSize:'16px', color:'#fafafa', fontFamily:'MONTSERRAT-MEDIUM'}}>AI & ML Innovation Lab</p>
                            </div>

                            <div className="subgroups" style={{ padding:'10px', alignItems:'center'}}> 
                            <div>
                                <img src={require('../resources/mobile.png')} style={{marginLeft:'50px',width:'30px', height:'30px'}}/>
                            </div>
                            <p style={{marginLeft:'17px',fontSize:'16px', color:'#fafafa', fontFamily:'MONTSERRAT-MEDIUM'}}>MIL Innovation Lab</p>
                            </div>

                            <div className="subgroups" style={{padding:'10px', alignItems:'center'}}> 
                            <div>
                                <img src={require('../resources/sil.png')} style={{marginLeft:'50px',width:'30px', height:'30px'}}/>
                            </div>
                            <p style={{marginLeft:'17px',fontSize:'16px', color:'#fafafa', fontFamily:'MONTSERRAT-MEDIUM'}}>SIL Innovation Lab</p>
                            </div>

                        </div>
                </div>
                    <div style={{position:'relative', overflow:'hidden', left:'30%', top:'60px'}}>  
                        {this.toggleCategories()}
                        </div>
                </div>
                </div>
        )
    }
}
