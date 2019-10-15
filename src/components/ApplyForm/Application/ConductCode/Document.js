/**
 * Conduc-code document
 * @param {Object} data 
 * @param {*} data.applicantName
 * @param {*} data.date
 * @param {*} data.signature
 */
const Document = (data = {}, lenguageform) => {
    const { applicantName, date, signature } = data;
    return lenguageform === 'en' 
    ?   `<div class="WordSection1">
        <p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center; font-size: 11pt; " align="center"><strong><span style="font-size: 15.5pt;">Tumi Staffing Code of Conduct</span></strong></p>
        <p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; font-size: 11pt; "><span style=" line-height: 110%;">&nbsp;</span></p>
        <ol>
        <li style="text-align: justify;"><span style="">As an employee of Tumi Staffing committed to providing the highest level of guest service with a commitment to quality in every aspect of my job;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I agree to follow all rules and regulations of both Tumi Staffing, and the employment partner or hotel where I am assigned to work;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I understand that I have a responsibility for my safety and security, as well as that of my co-workers and our clients and hotel guests, and will conduct myself in a safe manner, and report any accidents, or unsafe conditions immediately to ensure that corrective action is taken;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I will arrive to my workplace with sufficient time to ensure that I am in uniform and ready to clock-in and begin my work shift on time;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I will practice good hygiene, including bathing and washing my hair, being clean shaven, using deodorant, brushing my teeth before reporting to work, and using clothing that is clean, pressed and presentable for the work environment; </span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">When in the front of the house guest contact areas, I will conduct myself in a positive and professional manner, making contact with and offering a warm and friendly greeting to every guest I encounter;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I understand that a positive work environment is critical to the success of our business, and I will treat every other Tumi Staffing employee, supervisor or manager, or those of our employment partner with the same respect and dignity as we treat our hotel guests;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I will perform my assigned duties in a through and timely manner, with a positive attitude, always seeking to exceed the expectations of the guests and our employment partner;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I understand that open lines of communication and a free flow of information are critical to the success of our business and our relationship with our employment partner, and I will report to Tumi Staffing Management, any problems I encounter in the workplace or which are reported to me, including any inappropriate behavior by or toward any employee of Tumi Staffing, any safety or security hazards or violations, any guest or employee accidents, or any inappropriate or unethical conduct, and will never do anything to hinder communication between Tumi employees, supervisors, managers, or our employment partner;</span><span style="">&nbsp;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I will conduct myself with honesty and integrity in all interactions with my coworkers, hotel staff, supervisors and managers and will not engage in any unsafe or inappropriate conduct, or actions which would negatively reflect on Tumi Staffing or our hotel partner, or cause a conflict of interest with either one;</span></li>
        <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
        <li style="text-align: justify;"><span style="">I am committed to the success of Tumi Staffing, Inc and providing a positive environment to all of my fellow employees!</span></li>
        </ol>
        <p style="margin: 4.4pt 0in 0.0001pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Signed: <u><img id ="imgCanvasSign" width="150" height="auto" src="` +
        signature +
        `" alt=""></u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: <u>` +
        date +
        `</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
        <p style="margin: 4.4pt 0in 0.0001pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Printed Name: <u>` + applicantName + `</u></p>
        </div>`

        // Spanish *************************************************************************************************************************************************
    :   `<div class="WordSection1">
            <p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center;"
                align="center"><strong><span style="font-size: 15.5pt;">Tumi Staffing
                        Codigo de Conducta</span></strong></p>
            <p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; "><span
                    style=" line-height: 110%;">&nbsp;</span></p>
            <ol>
                <ol>
                    <li>Como trabajador de Tumi Staffing me comprometo a proporcionar un alto nivel de servicio con gran
                        calidad en cada aspecto de mi trabajo.</li>
                    <li><span style="">Me comprometo a seguir todas las reglas y regulaciones tanto de Tumi
                            Staffing como de la compania asociada o hotel donde yo este asignado a trabajar</span></li>
                    <li><span style="">Yo comprendo que soy responsable por mi seguridad, la seguidad de mis
                            companeros de trabajo, nuestros clientes y huespedes. Me conducire de una manera segura. Reportare
                            immediatamente cualquier accidente o insegura condicion para prevenir un accidente. </span></li>
                    <li><span style="">Voy a llegar a mi trabajo con suficiente tiempo para cambiarme ponerme
                            el uniforme y estar listo para iniciar mi jornmada de trabajo a tiempo.</span></li>
                    <li><span style="">Voy a presentarme con un buen aseo personal: banado, lavado ,peinado,
                            afeitado. Usare desodorante, cepillare mis dientes. Usare ropa limpia, presentable y
                            profesionalpara trabajar.</span></li>
                    <li>Cuando me encuentre en mi ambiente de trabajo me conducire con una actitud positive y profesional. Hare
                        contacto visual con los huespedes, ofreciendo un calida y amigable saludo.</li>
                    <li>Comprendo que un positvo ambiente de trabajo es crucial e importante para alcazar el exito en nuestro
                        negocio. Voy a tratar cada trabajador de Tumi Staffing, supervisor o manager y empleados de la compania
                        asociada con el mismo respeto y dignidad que trato a los huespedes.</li>
                    <li>Voy a hacer mis deberes de la mejor manera y en el correcto tiempo, con una actitud positive. Siempre
                        velare por alcanzar las espectativas del huesped y de nuestro compania asociada.</li>
                    <li><span style="">Comprendo que una abieta y fluida comunicacion es importante para el
                            exito de nuestro negocio y de nuestra relacion con la compania asociada. Reportare a Tumi Staffing
                            manager cualquier problema que yo encuentre o que me repoten en mi area de trabajo. Reportare
                            cualquier inapropiada conducta de cualquier trabajador de Tumi Staffing, violacion a la seguridad,
                            cualquier accidente de huesped o trabajador o inapropiada o no etica conducta. Nunca ocultare
                            informacion entre Tumi trabajador, supervisor, manager o nuestros companeros asociados.</span></li>
                    <li>Me conducire con honestidad e integridad en todo momento tanto con mis companeros de trabajo, personal
                        del hotel, supervisors y gerentes. No permitire ninguna inseguridad o inapropiada conducta o accion que
                        repercuta negativamente en Tumi Staffing o Hotel asociado, o que cause conflicto de intereses en uno u
                        otro.</li>
                    <li>Me comprometo con la compania Tumi Staffing a proporcionar positivo ambiente con todos los companeros
                        de trabajo.</li>
                </ol>
            </ol>
            <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
            <p style="margin: 5.4pt 0in 0.0001pt; font-size: 9.5pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Signed: <u><img  id ="imgCanvasSign" src="` + signature + `" alt="" width="150" height="auto" /></u>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: <u>` +
                            date + `</u>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
            <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
            <p style="margin: 5.4pt 0in 0.0001pt; font-size: 9.5pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                Printed Name: <u>` + applicantName + `</u></p>
        </div>
        <p>&nbsp;</p>`;
}

export default Document;