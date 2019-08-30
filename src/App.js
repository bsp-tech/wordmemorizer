import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";

class App extends React.Component {

  state = {
    wordsOriginal: [],
    wordsTranslation: [],
    notAnsweredWordsOriginal: [],
    notAnsweredWordsTranslation: [],
    randomAnswers: [],
    currentWordOriginal: '',
    currentWordTranslation: '',
    failCount: 0,
    howToUse: false
  }

  handleOriginalWords =  (event) => {
    const text = event.target.value;
    const arr = text.split("\n");
    this.setState({wordsOriginal: arr});
  }

  handleTranslationWords =  (event) => {
    const text = event.target.value;
    const arr = text.split("\n");
    this.setState({wordsTranslation: arr});
  }
 
  handleStart = ()=>{
    let {wordsOriginal, wordsTranslation, notAnsweredWordsOriginal, notAnsweredWordsTranslation} = this.state;

    if(this.state.wordsOriginal.length===0 && this.state.notAnsweredWordsOriginal.length === 0){
        return;
    }
    if(this.state.wordsOriginal.length===0){
        wordsOriginal = [...notAnsweredWordsOriginal];
        wordsTranslation = [...notAnsweredWordsTranslation];
        this.setState({
          wordsOriginal: wordsOriginal,
          wordsTranslation: wordsTranslation,
          notAnsweredWordsOriginal:[],
          notAnsweredWordsTranslation:[]
        });
    }
    // console.log('wordsOriginal.length='+wordsOriginal.length);
    // console.log('notAnsweredWordsOriginal='+notAnsweredWordsOriginal);
    // console.log('notAnsweredWordsTranslation='+notAnsweredWordsTranslation);
    // console.log("wordsOriginal="+JSON.stringify(wordsOriginal));
    // console.log("wordsTranslation="+JSON.stringify(wordsTranslation));
    // console.log("notAnsweredWordsTranslation="+JSON.stringify(notAnsweredWordsTranslation));

    const originalWordIndex = this.randomNumber(0, wordsOriginal.length);
    const selectedWordOriginal = wordsOriginal[originalWordIndex];
    const selectedWordTranslation = wordsTranslation[originalWordIndex];
    
    const randomAnswers = [];
    wordsTranslation = [...wordsTranslation];
    wordsTranslation.splice(originalWordIndex,1);

    const limit = wordsTranslation.length<5?wordsTranslation.length:5;
    for(var i=0;i<limit;i++){
      let randomAnswerIndex = this.randomNumber(0, wordsTranslation.length);
      // console.log('randomAnswerIndex='+randomAnswerIndex+', originalWordIndex='+originalWordIndex);
      let randomTranslationChoice = wordsTranslation[randomAnswerIndex];

      randomAnswers.push(randomTranslationChoice);
      wordsTranslation.splice(randomAnswerIndex,1);
    }

    // console.log(randomAnswers);
    // console.log(selectedWordTranslation);
    randomAnswers.push(selectedWordTranslation);

    const rr = this.randomNumber(0, randomAnswers.length);
    randomAnswers[randomAnswers.length-1] = randomAnswers[rr];
    randomAnswers[rr] = selectedWordTranslation;

    this.setState(
        {
          currentWordOriginal: selectedWordOriginal, 
          currentWordTranslation: selectedWordTranslation, 
          randomAnswers: randomAnswers, 
          failCount:0
        });
  }

  randomNumber = (min, max)=>{
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
  }

  handleCheckAnswer = (answer)=>{
      const {currentWordOriginal, currentWordTranslation, wordsOriginal, wordsTranslation, notAnsweredWordsOriginal, notAnsweredWordsTranslation} = this.state;
      let {failCount} = this.state;
      if(answer === currentWordTranslation){
        const index = wordsTranslation.indexOf(currentWordTranslation);
        wordsTranslation.splice(index,1);
        wordsOriginal.splice(index, 1);
        const nIndex = notAnsweredWordsOriginal.indexOf(currentWordOriginal);
        if(nIndex>=0){
          notAnsweredWordsOriginal.splice(nIndex,1);
          notAnsweredWordsTranslation.splice(nIndex,1);
        }
        this.setState(
          {
            failCount:0, 
            currentWordTranslation:'', 
            currentWordOriginal:'',
            wordsOriginal: wordsOriginal, 
            wordsTranslation: wordsTranslation, 
            notAnsweredWordsOriginal: notAnsweredWordsOriginal, 
            notAnsweredWordsTranslation: notAnsweredWordsTranslation, 
            randomAnswers:[]
          }
        );
        this.handleStart();
      }else{
        failCount++;
        if(failCount===3){
          const index = wordsTranslation.indexOf(currentWordTranslation);
          wordsTranslation.splice(index,1);
          wordsOriginal.splice(index, 1);
          notAnsweredWordsTranslation.push(currentWordTranslation);
          notAnsweredWordsOriginal.push(currentWordOriginal);
          this.setState(
            {
              failCount:0, 
              currentWordTranslation:'', 
              currentWordOriginal:'',
              wordsOriginal: wordsOriginal, 
              wordsTranslation: wordsTranslation, 
              notAnsweredWordsOriginal: notAnsweredWordsOriginal, 
              notAnsweredWordsTranslation: notAnsweredWordsTranslation, 
              randomAnswers:[]
            }
          );
          this.handleStart();
        }else{
          this.setState({failCount: failCount});
        }
      }
  }

  render() {
      const {wordsOriginal, currentWordOriginal, randomAnswers, failCount} = this.state;

      return (
        <React.Fragment >
            <div className="container pt-3">
                <div className="row">
                    <div className="col-md-12 text-center" 
                        style={{color:"#fff",width:"100%",backgroundColor:"#7d7d7d", padding:10, marginBottom:10}}>
                            <label className="h5" >
                                WordMemorizer helps you to memorize words in any foreign languages.
                            </label>
                            <br/>

                            <button className="btn btn-primary" onClick={()=>{
                              this.state.howToUse=!this.state.howToUse;
                              this.setState({});
                              }}>
                                  How to use?
                                </button>
                    </div>
                    <div className={"col-md-12 text-center "+(this.state.howToUse?"":"collapse")} >
                            <iframe src='https://www.youtube.com/embed/dQMwQMGkIPI'
                                    frameBorder='0'
                                    allow='autoplay; encrypted-media'
                                    allowFullScreen
                                    style={{width:"100%", height:"500px"}}
                                    title='video'
                            />
                    </div>
                  
                </div>
                <div className="row">
                        <div className="form-group col-md-4">
                            <textarea placeholder='Write words line by line in foreign language you want to learn'
                                      onChange={this.handleOriginalWords} 
                                      className="form-control" 
                                      rows="5">
                            </textarea>
                            
                        </div>
                        <div className="form-group col-md-4">
                            <textarea placeholder="Write translation of foreign words in your main language line by line"  
                                      onChange={this.handleTranslationWords} 
                                      className="form-control" 
                                      rows="5"></textarea>
                        </div>
                        <div className="form-group col-md-4">
                            <textarea placeholder="You answered 3 times wrong these words. Don't worry these words will be asked later again"
                                      value={this.state.notAnsweredWordsOriginal} 
                                      readOnly 
                                      className="form-control" 
                                      rows="5"></textarea>
                        </div>  
                </div>
                <div className="row d-flex justify-content-center">
                    <button className="btn btn-primary" onClick={this.handleStart}>START TO MEMORIZE</button>
                </div>
                <div>
                  <div>{"Words left:"+ wordsOriginal.length}</div>
                </div>
                <div className="text-center">
                      <div>Translation of {currentWordOriginal}</div>
                      <div className="text-danger">Try left: {(3-failCount)}</div>
                      <div className="d-flex justify-content-sm-center">
                        {
                          randomAnswers.map((answer, index)=>{
                              return (
                                <button key={index} className="btn btn-primary m-1" onClick={()=>this.handleCheckAnswer(answer)}>{answer}</button>
                              )
                          })
                        }
                      </div>
                </div>
                
            </div>
            <footer class="py-3 bg-dark text-white-50 text-center" style={{backgroundColor:"rgb(183, 183, 183)", marginTop:260}}>
                <img src="bsptech.png" style={{width:100}}/>
                <div class="footer-copyright text-center py-3">© Powered by:
                  <a href="https://github.com/bsp-tech/"> BSP TECH Open Source Community</a>
                </div>
            </footer>
        </React.Fragment>


      );
  }
}

export default App;
