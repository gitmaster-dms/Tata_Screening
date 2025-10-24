import React from 'react'
import redheart from '../../../../Images/RedHeart.png'
import blue from '../../../../Images/Blueheart.png'
import hb from '../../../../Images/blueheartline.png'
import temp from '../../../../Images/temperature.png'
import green from '../../../../Images/Greenheart.png'
import sat from '../../../../Images/Darkgreenheart.png'
import './VitalHealth.css'

const Vitalhealth = ({ vitalsData = [] }) => {

    console.log('dataa from healthcard vital:', vitalsData);

    return (
        <div>
            <h6 className="basichealthcarddddd">Vital</h6>
            <div className="elementbasicscreen"></div>
            {vitalsData && vitalsData.length > 0 && vitalsData.map((vital, index) => (
                <div className="row vitalcardsnew" key={index}>
                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='redherats' src={redheart} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">Pulse</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.pulse} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard'>
                                        <h6 className='healthcardtypedefine1'>{vital.pulse_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='' src={green} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">BP(Dys)</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.dys_mm} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard1'>
                                        <h6 className='healthcardtypedefine2'>{vital.dys_mm_mm_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='' src={green} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">BP(Sys)</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.sys_mm} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard1'>
                                        <h6 className='healthcardtypedefine2'>{vital.sys_mm_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='' src={blue} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">RR</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.rr} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard2'>
                                        <h6 className='healthcardtypedefine3'>{vital.rr_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='' src={hb} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">HB</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.hb} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard3'>
                                        <h6 className='healthcardtypedefine4'>{vital.hb_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img src={sat} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">O2 Sats</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.oxygen_saturation} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard4'>
                                        <h6 className='healthcardtypedefine5'>{vital.oxygen_saturation_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card healthcardvital">
                            <div className="row">
                                <div className="col-md-4">
                                    <div className="card redheartcard">
                                        <img className='' src={temp} />
                                    </div>
                                </div>
                                <div className="col-md-8 vitalhealthcard">Temperature</div>
                                <div className="col-md-12">
                                    <input className='form-control vitalhealthcardinput' value={vital.temp} readOnly />
                                </div>
                                <div className="col-md-12">
                                    <div className='card reporttypehealthcard5'>
                                        <h6 className='healthcardtypedefine6'>{vital.temp_conditions}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))
            }
        </div>
    )
}

export default Vitalhealth
