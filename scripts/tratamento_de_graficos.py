import datetime
import pathlib

data = datetime.date.today().strftime('%d/%m/%Y')
arquivo_aniversario = pathlib.Path('../Banco_Dados_Teste') / 'aniversario.txt'
arquivo_ata = pathlib.Path('../Banco_Dados_Teste') / 'ata_medica.txt'

def aniversario():
    print('\n********** Aniversáriantes **********\n')
    global data
    if arquivo_aniversario.exists():
        with arquivo_aniversario.open('r', encoding='utf-8') as aberto:
            dados_aniversario = aberto.readlines()
            for item in dados_aniversario:
                datas = item.split('-')[2]
                mes = datas.split('/')[1]
                if int(mes) == int(data.split('/')[1]):
                    print(f'O {item.split('-')[1]} ta de aniversário esse mes no dia {datas.split('/')[0]}')
                elif int(mes) == int(data.split('/')[1]) + 1:
                    print(f'O {item.split('-')[1]} ta de aniversário mes que mes no dia {datas.split('/')[0]}')
                elif int(mes) == int(data.split('/')[1]) + 2:
                    print(f'O {item.split('-')[1]} ta de aniversário no posterior no dia {datas.split('/')[0]}')
    else:
        print('Não Achei')
    print('\n*************************************')


def ataMedica():
    if arquivo_ata.exists():
        with arquivo_ata.open('r', encoding='utf-8') as ata_aberta:
            conteudo = ata_aberta.readlines()
            for item in conteudo:
                data = item.split('-')[2].strip()
                dia = int(data.split('/')[0])
                mes = int(data.split('/')[1])
                ano = int(data.split('/')[2])

                mes += 6
                if mes > 12:
                    mes -= 12
                    ano += 1

                try:
                    validade = datetime.date(ano, mes, dia)
                except ValueError:
                    validade = datetime.date(ano, mes + 1, 1) - datetime.timedelta(days=1)

                hoje = datetime.date.today()
                nome = item.split('-')[1].strip()

                if validade >= hoje:
                    ata_valida = [item.split('-')[1],validade.strftime("%d,%m,%y")]
                    data_valida = ata_valida[1]
                    pessoa_val = ata_valida[0]
                    if int(data_valida.split(',')[1]) == validade.month + 1 :
                        print(f'O(a) {pessoa_val} vence no próximo mês, na data {data_valida}.')
                    elif int(data_valida.split(',')[1]) == validade.month + 2 :
                        print(f'O(a) {pessoa_val}, vence no mês posterior {data_valida}')
                else:
                    ata_vencida = [item.split('-')[1],validade.strftime("%d,%m,%y")]
                    data_vencida = ata_vencida[1]
                    pessoa_ven = ata_vencida[0]
                    print(f'{pessoa_ven} teve vencimento em {data_vencida}.')

    if arquivo_ata.exists():
        with arquivo_ata.open('r', encoding='utf-8') as ata_aberta:
            conteudo = ata_aberta.readlines()
            for item in conteudo:
                partes = item.strip().split('-')
                nome = partes[1].strip()
                dia, mes, ano = map(int, partes[2].split('/'))

                mes += 6
                if mes > 12:
                    mes -= 12
                    ano += 1

                try:
                    validade = datetime.date(ano, mes, dia)
                except ValueError:
                    validade = datetime.date(ano, mes + 1, 1) - datetime.timedelta(days=1)

                hoje = datetime.date.today()
                if validade >= hoje:
                    meses_restantes = (validade.year - hoje.year) * 12 + (validade.month - hoje.month)
                    if meses_restantes == 1:
                        print(f'{nome} - Atestado vence mês que vem ({validade.strftime("%d/%m/%Y")})')
                    elif meses_restantes == 2:
                        print(f'{nome} - Atestado vence em dois meses ({validade.strftime("%d/%m/%Y")})')
    else:
        print('Arquivo de atestados não encontrado.')

aniversario()
ataMedica()
