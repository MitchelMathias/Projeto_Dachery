import datetime
import pathlib
import re
import requests
from bs4 import BeautifulSoup
import time
from urllib.parse import urlparse

data = datetime.date.today().strftime('%d/%m/%Y')
arquivo_aniversario = pathlib.Path('../Banco_Dados_Teste') / 'aniversario.txt'
arquivo_ata = pathlib.Path('../Banco_Dados_Teste') / 'ata_medica.txt'
arquivo_ferias = pathlib.Path('../Banco_Dados_Teste') / 'ferias.txt'

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

def adicionar_meses(data_origem, meses):
    mes = data_origem.month - 1 + meses
    ano = data_origem.year + (mes // 12)
    mes = (mes % 12) + 1
    dia = data_origem.day
    try:
        return datetime.date(ano, mes, dia)
    except ValueError:
        # Ajusta para o último dia do mês se o dia for inválido
        return datetime.date(ano, mes, 1) - datetime.timedelta(days=1)

def ataMedicaOtimizacao():
    global data
    if arquivo_ata.exists():
        with arquivo_ata.open('r', encoding="utf-8") as ata_aberta:
            for linha in ata_aberta:
                partes = linha.strip().split('-')
                if len(partes) < 3:
                    continue  # Formato inválido
                nome = partes[1]
                data_str = partes[2]
                try:
                    dia, mes, ano = map(int, data_str.split('/'))
                    data_ata = datetime.date(ano, mes, dia)
                except ValueError:
                    continue  # Data inválida
                
                data_expiracao = adicionar_meses(data_ata, 6)
                hoje = datetime.date.today()

                if data_expiracao < hoje:
                    print(f"{nome}: Vencida")
                else:
                    # Verifica este mês
                    if data_expiracao.year == hoje.year and data_expiracao.month == hoje.month:
                        print(f"{nome}: Vence este mês")
                    else:
                        # Verifica próximo mês
                        proximo_mes = adicionar_meses(hoje, 1).replace(day=1)
                        if (data_expiracao.year == proximo_mes.year and 
                            data_expiracao.month == proximo_mes.month):
                            print(f"{nome}: Vence próximo mês")
                        else:
                            print(f"{nome}: Em dia")

def ferias():
    if arquivo_ferias.exists():
        feriasNesseMes = []
        feriasProximoMes = []
        feriasPosterior = []
        hoje = datetime.date.today()
        dia_at, mes_at, ano_at = hoje.day, hoje.month, hoje.year

        with arquivo_ferias.open('r', encoding='utf-8') as arquivo_aberto:
            conteudo = arquivo_aberto.readlines()
            for item in conteudo:
                partes = item.strip().split('-')
                nome = partes[1]
                data = partes[2]
                dia, mes, ano = map(int, data.split('/'))

                if ano + 1 == ano_at:
                    if mes == mes_at:
                        feriasNesseMes.append(nome)
                    elif (mes == (mes_at % 12) + 1):
                        feriasProximoMes.append(nome)
                    elif (mes == (mes_at % 12) + 2):
                        feriasPosterior.append(nome)

        if feriasNesseMes:
            print(f"Férias neste mês: {', '.join(feriasNesseMes)}")
        if feriasProximoMes:
            print(f"Férias no próximo mês: {', '.join(feriasProximoMes)}")
        if feriasPosterior:
            print(f"Férias no mês seguinte ao próximo: {', '.join(feriasPosterior)}")
        if not (feriasNesseMes or feriasProximoMes or feriasPosterior):
            print('Ninguém de férias.')
