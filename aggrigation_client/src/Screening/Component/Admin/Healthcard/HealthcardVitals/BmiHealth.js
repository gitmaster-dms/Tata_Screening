import React from 'react';
import './BasicScreenVital.css';

const BmiHealth = ({ bmiData }) => {
    console.log(bmiData);

    if (!bmiData || bmiData.length === 0) {
        return (
            <div>
                <h6 className="basichealthcarddddd">BMI & Symptoms</h6>
                <div className="elementbasicscreen ml-3"></div>
                No BMI data available.
            </div>
        );
    }

    const bmiInfo = bmiData[0];

    return (
        <div>
            <h6 className="basichealthcarddddd">BMI & Symptoms</h6>
            <div className="elementbasicscreengrowthhhh"></div>

            <div className="row p-2">
                <div className="col-md-4">
                    <div className="row">
                        <div className="col-md-12 mb-2">
                            <div className="card" style={{ backgroundColor: '#F8DEBD', height: '100%' }}>
                                <div className="row">
                                    <div className="col-md-7">
                                        <h6 className="cardnamehealthcardss">Height</h6>
                                    </div>
                                    <div className="col-md-5 weeethtth">{bmiInfo.height} cm</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12 mb-2">
                            <div className="card" style={{ backgroundColor: '#D0FBFF', height: '100%' }}>
                                <div className="row">
                                    <div className="col-md-7">
                                        <h6 className="cardnamehealthcardss">Weight</h6>
                                    </div>
                                    <div className="col-md-5 weeethtth">{bmiInfo.weight} kg</div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12">
                            <div className="card" style={{ backgroundColor: '#FFECF2', height: '100%' }}>
                                <div className="row">
                                    <div className="col-md-7">
                                        <h6 className="cardnamehealthcardss">Arm Size</h6>
                                    </div>
                                    <div className="col-md-5 weeethtth">
                                        {bmiInfo.armSize}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {bmiInfo.bmi ? (
                    <div className="col-md-8">
                        <div className="card cardbmigeakthcarddsssss">
                            <h6 className='m-2'> BMI: {bmiInfo.bmi}</h6>
                            {/* <div className='row belowheading'>
                                <input className='widget' />
                                <div className="labels">
                                    <span className="label-red">Underweight</span>
                                    <span className="label-red">Normal</span>
                                    <span className="label-red">Overweight</span>
                                    <span className="label-red">Obesity</span>
                                </div>
                            </div> */}
                        </div>
                    </div>
                ) :
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12 mb-2">
                                <div className="card weightcardforagehealthcard">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="cardnamehealthcardss1">Weight For Age</h6>
                                        </div>
                                        <div className="col-md-6 dataaaaaaaa">
                                            {bmiInfo.weightForAge}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mb-2">
                                <div className="card weightcardforagehealthcard1">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="cardnamehealthcardss1">Weight For Height</h6>
                                        </div>
                                        <div className="col-md-6 dataaaaaaaa">
                                            {bmiInfo.weightForHeight}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12 mb-3">
                                <div className="card weightcardforagehealthcard2">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="cardnamehealthcardss1">Height For Age</h6>
                                        </div>
                                        <div className="col-md-6 dataaaaaaaa">
                                            {bmiInfo.heightForAge}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default BmiHealth;
