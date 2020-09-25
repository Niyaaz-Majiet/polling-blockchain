import React from 'react';

const Block = props =>{
    return(
        <div>
            <h3>Block Ref : {props.block.hash}</h3>
            {
                props.block.data.map((report)=>{
                        return(
                            <div key={report.id}>
                                <h4>Total Votes : {report.reportData.voters.length}</h4>
                                <h4>Total Yes Votes : {report.reportData.votes}</h4>
                                <h4>Topic : {report.reportData.data.report_data.topic}</h4>
                                <h4>About : {report.reportData.data.report_data.about}</h4>
                                <hr/>
                            </div>
                        )
                })
            }
        </div>
    );
};

export default Block;