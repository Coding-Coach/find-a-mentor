import notFoundImage from  './assets/404.svg'
import Header from './components/Header/Header'
import styled from 'styled-components';
const StyleImage = styled.div`
    padding: 20px;
    .imge{
        max-width: 35vw;
        max-height: 35vh;
    }
`;
const Content = styled.div` 
.container{
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
    padding-top: 15vh;
}
.row{        
    display: inline-grid;
    grid-template-columns: auto auto ;
}    
`;    
const PageNotFound = () => {
    return (
        <div>
            <Header/>
            <Content>
                <div className="container py-16 blog-content md:flex md:py-64">
                    <div className="row">
                        <div className="col">
                            <StyleImage>
                                    <img src={notFoundImage} alt="" className="imge"/>                            
                            </StyleImage>
                        </div>  
                        <div className="col">
                            <div className="flex-1 md:pl-16 ">
                                <h1>Not Found</h1>
                                <h3>
                                You just hit a route that doesn&#39;t exist... What can you do now?
                                That's a good question! There are several things you can do, going to{' '}
                                <a href="/">home page</a> would be a good idea. You might want to{' '}
                                <a href="/blog">read the blog</a>, we have very interesting
                                articles and tutorials! Maybe looking for{' '}
                                <a href="https://mentors.codingcoach.io">a mentor</a> to improve your
                                career?
                                </h3>
                                <h3>
                                How did you get here? Is this a broken link within the blog? Or maybe
                                a link from a third party website? Please{' '}
                                <a href="mailto:admin@codingcoach.io">let us know</a> and we will fix it
                                ASAP!
                                </h3>
                            </div>
                        </div>  
                    </div>
                </div>
            </Content>
        </div>
    )
}

export default PageNotFound
